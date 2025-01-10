import express from 'express';
import companies from './routes/companies.js';
import prices from './routes/prices.js';
import predictions from './routes/predictions.js';

import logger from './middleware/logger.js';
import setCORsHeaders from './middleware/allowCORs.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);
app.use(setCORsHeaders);

// Routes
app.use('/api/companies', companies);
app.use('/api/prices', prices);
app.use('/api/predictions', predictions);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));