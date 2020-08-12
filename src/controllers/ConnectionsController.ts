// Modules
import {Response, Request } from 'express';

// Database
import db from '../database/connection';

export default class ConnectionsController {
  // Connection index
  async index(req: Request, res: Response) {
    const totalConnections = await db('connections').count('* as total');

    const { total } = totalConnections[0];

    return res.status(201).json({total});
  }

  // Create a connection
  async create(req: Request, res: Response) {
    try {
      const { user_id } = req.body;

      await db('connections').insert({
        user_id,
      });

      return res.status(201).send();
    } catch (error) {
      console.log(error);
    }
    
  }
}