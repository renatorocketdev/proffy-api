// Modukes
import express from 'express';

// Imports
import routes from './routes';

// Initialize
const app = express();

// Use json
app.use(express.json());

// Routes
app.use(routes)

// Listen
app.listen(3000);