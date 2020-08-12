// Modules
import express from 'express';

// Controllers
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

// Init Routes
const routes = express.Router();

// Controllers instances
const classesControllers = new ClassesController();
const connectionsControllers = new ConnectionsController();

// Routes
routes.get('/classes', classesControllers.index);
routes.post('/classes', classesControllers.create);

routes.get('/connections', connectionsControllers.index);
routes.post('/connections', connectionsControllers.create);

// Export
export default routes;