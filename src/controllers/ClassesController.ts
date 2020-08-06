import { Request, Response } from "express";

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHoursToMinutes';

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

export default class ClassesController {
  async create(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = req.body;
  
    const trx = await db.transaction();
  
    try {
      
      const insertUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });
  
      const user_id = insertUsersId[0];
  
      const insertClassesId = await trx('classes').insert({
        subject,
        cost,
        user_id
      });
  
      const class_id = insertClassesId[0];
  
      const classSchedule = schedule.Map((scheduleItem: ScheduleItem) => {
        return {
            class_id,
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from),
            to: convertHourToMinutes(scheduleItem.to)
        };
      });
  
      await trx('class_schedule').insert(classSchedule);
  
      await trx.commit();
  
      return res.status(201).send();
    } catch (error) {
      trx.rollback();    
      
      res.status(400).json({ Message: error });
    }
  }
}