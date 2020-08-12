// Modules
import { Request, Response } from 'express';

// Database
import db from '../database/connection';

// Utils
import convertHourToMinutes from '../utils/convertHoursToMinutes';

//  Interface for schedule
interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  // Classes index
  async index(req: Request, res: Response) {
    const filters = req.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    if (!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).json({ error: 'Missing filters to search classes' });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
          .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
          .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
          .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
      })
      .where('classes.subject', '=', subject)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

      return res.status(200).json(classes);
  }

  // Create a connection
  async create(req: Request, res: Response) {
    // Pegar a requisição e salvar em variáveis
    const { name, avatar, whatsapp, bio, subject, cost, schedules } = req.body;

    // Initialize transaction
    const trx = await db.transaction();

    try {
      // Insert User
      const insertUsersId = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      // Get first id inserted
      const user_id = insertUsersId[0];

      // Insert classes
      const insertClassesId = await trx('classes').insert({
        subject,
        cost,
        user_id,
      });

      // Get first id inserted
      const class_id = insertClassesId[0];

      // Mapping array object
      const classSchedule = schedules.map((scheduleItem: ScheduleItem) => ({
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
      }));

      await trx('class_schedule').insert(classSchedule);

      await trx.commit();

      return res.status(201).send();
    } catch (error) {
      trx.rollback();

      res.status(400).json({ Message: error });
    }
  }
}
