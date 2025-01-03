const setCORsHeaders = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(origin);
    if (origin.contains(process.env.FRONTEND_URL)) {
        console.log('Setting CORs headers');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
    }

    next();
};

export default setCORsHeaders;