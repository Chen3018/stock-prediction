import get from 'axios';

const api = 'https://financialmodelingprep.com/api/v3'

// @desc    Get best matches for a keyword
// @route   GET /api/companies/:key
export const getMatches = async (req, res, next) => {
    const key = req.params.key;
    const apiUrl = `${api}/search?query=${key}&limit=10&apikey=${process.env.API_KEY}`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (data.length === 0 || !data[0].symbol) {
            const error = new Error(`Error searching keyword ${key}`);
            error.status = 404;
            return next(error);
        }
        
        const prioritized = [];
        const others = [];

        for (let i = 0; i < data.length; i++) {
            const exchange = data[i].exchangeShortName;
            data[i] = {
                symbol: data[i].symbol,
                name: data[i].name,
            }

            if (exchange === 'NASDAQ' || exchange === 'NYSE') {
                prioritized.push(data[i]);
            } else {
                others.push(data[i]);
            }
        }

        res.status(200).json(prioritized.concat(others));
    } catch (error) {
        console.log('Error searching keyword', error);
        const err = new Error(`Error searching keyword ${key}`);
        err.status = 404;
        return next(err);
    }

};

// @desc    Get info for a company
// @route   GET /api/companies/info/:symbol
export const getCompany = async (req, res, next) => {
    const symbol = req.params.symbol;
    const apiUrl = `${api}/profile/${symbol}?apikey=${process.env.API_KEY}`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (data.length === 0 || !data[0].symbol) {
            const error = new Error(`Error getting company information for ${symbol}`);
            error.status = 404;
            return next(error);
        }

        const info = { 
            symbol: data[0].symbol, 
            name: data[0].companyName, 
            description: data[0].description,
            price: data[0].price,
            change: data[0].changes
        };

        res.status(200).json(info);
    } catch (error) {
        console.log('Error getting company information', error);
        const err = new Error(`Error getting company information for ${symbol}`);
        err.status = 404;
        return next(err);
    }
};