import get from 'axios';

const api = 'https://www.alphavantage.co/query'

// @desc    Get best matches for a keyword
// @route   GET /api/companies/:key
export const getMatches = async (req, res, next) => {
    const key = req.params.key;
    //const apiUrl = `${api}?function=SYMBOL_SEARCH&keywords=${key}&apikey=${process.env.API_KEY}`;
    const apiUrl = `${api}?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (!data['bestMatches']) {
            const error = new Error(`Error searching keyword ${key}`);
            error.status = 404;
            return next(error);
        }

        const matches = data['bestMatches'];
        for (let i = 0; i < matches.length; i++) {
            matches[i] = {
                symbol: matches[i]['1. symbol'],
                name: matches[i]['2. name'],
            }
        }

        res.status(200).json(matches);
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
    //const apiUrl = `${api}?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.API_KEY}`;
    const apiUrl = `${api}?function=OVERVIEW&symbol=IBM&apikey=demo`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (!data['Symbol']) {
            const error = new Error(`Error getting company information for ${symbol}`);
            error.status = 404;
            return next(error);
        }

        const info = { symbol: data['Symbol'], name: data['Name'], description: data['Description'] };

        res.status(200).json(info);
    } catch (error) {
        console.log('Error getting company information', error);
        const err = new Error(`Error getting company information for ${key}`);
        err.status = 404;
        return next(err);
    }
};