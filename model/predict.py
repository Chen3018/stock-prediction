import sys
import numpy as np
import pandas as pd
import yfinance as yf
import torch
import math

symbol = sys.argv[1]

device = "cuda" if torch.cuda.is_available() else "cpu"

config = {
    "enc_num_layers": 6,
    "enc_num_heads": 8,
    "d_model": 256,
    "d_ff": 1024,
    "history_length": 24,
    "enc_dropout": 0.25,
    "learning_rate": 2E-4,
    "epochs": 100
}

#Data preprocessing and model metrics inspired by
#https://medium.com/@Matthew_Frank/stock-price-prediction-using-transformers-2d84341ff213

#Helper functions
def calculate_bollinger_bands(data, window=10, num_of_std=2):
    """Calculate Bollinger Bands"""
    rolling_mean = data.rolling(window=window).mean()
    rolling_std = data.rolling(window=window).std()
    upper_band = rolling_mean + (rolling_std * num_of_std)
    lower_band = rolling_mean - (rolling_std * num_of_std)
    return upper_band, lower_band

def calculate_rsi(data, window=10):
    """Calculate Relative Strength Index"""
    delta = data.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=window, min_periods=1).mean()
    avg_loss = loss.rolling(window=window, min_periods=1).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_roc(data, periods=10):
    """Calculate Rate of Change."""
    roc = ((data - data.shift(periods)) / data.shift(periods)) * 100
    return roc

def load_model(model, optimizer=None, scheduler=None, path='./checkpoint.pth'):
    checkpoint = torch.load(path, map_location=torch.device(device))
    model.load_state_dict(checkpoint['model_state_dict'])
    if optimizer is not None:
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    else:
        optimizer = None
    if scheduler is not None:
        scheduler.load_state_dict(checkpoint['scheduler_state_dict'])
    else:
        scheduler = None
    epoch = checkpoint['epoch']
    return model, optimizer, scheduler, epoch

#Model
class PositionalEncoding(torch.nn.Module):
    ''' Position Encoding from Attention Is All You Need Paper '''

    def __init__(self, d_model, max_len=512):
        super().__init__()

        # Initialize a tensor to hold the positional encodings
        pe          = torch.zeros(max_len, d_model)

        # Create a tensor representing the positions (0 to max_len-1)
        position    = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)

        # Calculate the division term for the sine and cosine functions
        # This term creates a series of values that decrease geometrically, used to generate varying frequencies for positional encodings
        div_term    = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))

        # Compute the positional encodings using sine and cosine functions
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)

        # Reshape the positional encodings tensor and make it a buffer
        pe = pe.unsqueeze(0)
        self.register_buffer("pe", pe)

    def forward(self, x):
      return x + self.pe[:, :x.size(1)]
    
class EncoderLayer(torch.nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout):
        super(EncoderLayer, self).__init__()

        self.pre_norm = torch.nn.LayerNorm(d_model)
        self.self_attn = torch.nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        self.ffn1 = torch.nn.Sequential(
            torch.nn.Linear(d_model, d_ff),
            torch.nn.GELU(),
            torch.nn.Dropout(dropout),
            torch.nn.Linear(d_ff, d_model),
        )
        self.dropout = torch.nn.Dropout(dropout)
        self.norm1 = torch.nn.LayerNorm(d_model)
        self.norm2 = torch.nn.LayerNorm(d_model)

    def forward(self, x):
        x_norm = self.pre_norm(x)

        x_attn, _ = self.self_attn(x_norm, x_norm, x_norm)

        x_norm = self.norm1(x + self.dropout(x_attn))

        x_ffn = self.ffn1(x_norm)

        x = self.norm2(x_norm + self.dropout(x_ffn))

        return x

class Encoder(torch.nn.Module):
    def __init__(self,
                 num_layers,
                 d_model,
                 num_heads,
                 history_length,
                 d_ff,
                 dropout=0.1):

        super(Encoder, self).__init__()

        self.upscale = torch.nn.Linear(7, d_model)
        self.pos_encoding = PositionalEncoding(d_model, history_length)
        self.dropout =  torch.nn.Dropout(dropout)
        self.enc_layers =  torch.nn.ModuleList([EncoderLayer(d_model, num_heads, d_ff, dropout) for _ in range(num_layers)])
        self.average_pool = torch.nn.AdaptiveAvgPool1d(1)
        self.after_norm =  torch.nn.LayerNorm(history_length)
        self.ctc_head   =  torch.nn.Linear(history_length, 1)

    def forward(self, x):
        x = self.upscale(x)

        x_pos = self.pos_encoding(x)

        x_drop = self.dropout(x_pos)

        x_res = x + x_drop

        for layer in self.enc_layers:
            x_res = layer(x_res)

        x_res = torch.squeeze(self.average_pool(x_res))

        x = self.after_norm(x_res)

        x_ctc = self.ctc_head(x)

        return x
    
model = Encoder(config["enc_num_layers"], config["d_model"], config["enc_num_heads"], config["history_length"], config["d_ff"], config["enc_dropout"])

optimizer = torch.optim.AdamW(model.parameters(),
                            lr=float(config["learning_rate"]),
                            weight_decay=0.01)

scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer,
                T_max = config["epochs"], eta_min=1E-8)

model, optimizer, scheduler, epoch = load_model(model, optimizer, scheduler, "../model/best_dir(79.83).pth")

data = yf.download(symbol, interval='5m', period='5d')

close = data['Close']
upper, lower = calculate_bollinger_bands(close, window=14, num_of_std=2)
width = upper - lower
rsi = calculate_rsi(close, window=14)
roc = calculate_roc(close, periods=14)
volume = data['Volume']
diff = data['Close'].diff(1)
percent_change_close = data['Close'].pct_change() * 100

data = pd.DataFrame({
  'close': [i[0] for i in close.values.tolist()],
  'width': [i[0] for i in width.values.tolist()],
  'rsi': [i[0] for i in rsi.values.tolist()],
  'roc': [i[0] for i in roc.values.tolist()],
  'volume': [i[0] for i in volume.values.tolist()],
  'diff': [i[0] for i in diff.values.tolist()],
  'percent_change_close': [i[0] for i in percent_change_close.values.tolist()],
})


mean = data.mean()
std = data.std()

data = (data - mean) / (std)

data.replace([np.inf, -np.inf], np.nan, inplace=True)
data.dropna(inplace=True)

close = data['close'].values
width = data['width'].values
rsi = data['rsi'].values
roc = data['roc'].values
volume = data['volume'].values
diff = data['diff'].values
pct_change = data['percent_change_close'].values

ticker_data = np.column_stack((close,
                              width,
                              rsi,
                              roc,
                              volume,
                              diff,
                              pct_change))

sequence = np.array(ticker_data[len(ticker_data) - config["history_length"]:])
sequence = torch.FloatTensor(sequence).unsqueeze(0).to(device)

model.eval()
output = model(sequence)

output = output[0] * std['close'] + mean['close']

print(output.item())