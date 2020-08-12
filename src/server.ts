// Modules
import express from 'express';
import cors from 'cors';

// Imports
import routes from './routes';

// Initialize
const app = express();

// Uses
app.use(express.json());
app.use(cors());

// Routes
app.use(routes)

// Listen
app.listen(3000);