import get from 'axios';

const api = 'https://financialmodelingprep.com/api/v3'

// @desc    Get daily stock prices for a company
// @route   GET /api/prices/day/:symbol
export const getDayPrices = async (req, res, next) => {
    const symbol = req.params.symbol;
    const today = new Date();
    const twoYearsAgo = `${today.getFullYear() - 2}-${today.getMonth() + 1}-${today.getDate()}`;
    const apiUrl = `${api}/historical-price-full/${symbol}?from=${twoYearsAgo}&apikey=${process.env.API_KEY}`;
    
    try {
        const response = await get(apiUrl);
        const data = response.data;

        if (!data.symbol) {
            const error = new Error(`Error getting daily prices for ${symbol}`);
            error.status = 404;
            return next(error);
        }

        const prices = data.historical.map((value) => {
            return {
                date: value.date,
                price: value.close,
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