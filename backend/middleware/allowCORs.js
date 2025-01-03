const setCORsHeaders = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(origin);
    if (origin.includes(process.env.FRONTEND_URL)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
    }

    next();
};

export default setCORsHeaders;