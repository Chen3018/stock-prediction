import get from 'axios';

const api = 'https://www.alphavantage.co/query'

// @desc    Get daily stock prices for a company
// @route   GET /api/prices/day/:symbol
export const getDayPrices = async (req, res, next) => {
    const symbol = req.params.symbol;
    //const apiUrl = `${api}?function=TIME_SERIES_DAILY&symbol=${key}&apikey=${process.env.API_KEY}`;
    const apiUrl = `${api}?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (!data['Time Series (Daily)']) {
            const error = new Error(`Error getting daily prices for ${symbol}`);
            error.status = 404;
            return next(error);
        }

        const prices = Object.keys(data['Time Series (Daily)']).map((key) => {
            return {
                date: key,
                price: data['Time Series (Daily)'][key]['4. close'],
            }
        })

        res.status(200).json(prices);
    } catch (error) {
        console.log('Error getting daily prices', error);
        const err = new Error(`Error getting daily prices for ${symbol}`);
        err.status = 404;
        return next(err);
    }

};