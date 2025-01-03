const setCORsHeaders = (req, res, next) => {
    const origin = req.headers.origin;
    //if (origin.contains(process.env.FRONTEND_URL)) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'content-type');
    //}

    next();
};

export default setCORsHeaders;