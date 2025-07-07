import { Op, QueryTypes } from 'sequelize';
import logger from '../logging/logger';
import { Task as TaskType, TaskTime as TaskTimeType } from '../types';
import { Sequelize } from 'sequelize';
import { CONSTANTS } from '../constants';

function getDataApi(model: any, sequelize: Sequelize) {
  const { Task, TaskTime } = model;
  // type TaskInstance = InstanceType<typeof Task>;
  type TaskTimeInstance = InstanceType<typeof TaskTime>;

  async function getAllTasks(): Promise<TaskType[]> {
    const tasks: TaskType[] = await sequelize.query(
      `SELECT 
        "task"."id",
        "task"."name",
        "task"."createdAt",
        "task"."updatedAt",
      GREATEST(max("taskTimes"."start"), max("taskTimes"."stop"), "task"."updatedAt") as "lastTime",
      CASE 
        WHEN min("taskTimes"."start") IS NOT NULL AND count(*) > count("taskTimes"."stop") THEN true
      ELSE
        false
      END AS "active",
      SUM ("taskTimes"."stop" - "taskTimes"."start") AS "duration",
      EXTRACT(EPOCH FROM (SUM("taskTimes"."stop"::timestamp - "taskTimes"."start"::timestamp))) AS "secondsDuration"
      FROM "tasks" AS "task" 
      LEFT OUTER JOIN "taskTimes" AS "taskTimes" ON "task"."id" = "taskTimes"."taskId"
      GROUP BY "task".id
      ORDER BY "lastTime" DESC;`,
      {
        type: QueryTypes.SELECT,
      }
    );
    logger.info(`[DataApi] getAllTasks: count: ${tasks.length}`);
    return tasks;
  }

  async function getTask(id: number): Promise<TaskType> {
    const tasks: TaskType[] = await sequelize.query(
      `SELECT 
        "task"."id",
        "task"."name",
        "task"."createdAt",
        "task"."updatedAt",
        GREATEST(max("taskTimes"."start"), max("taskTimes"."stop"), "task"."updatedAt") as "lastTime",
        CASE 
        WHEN min("taskTimes"."start") IS NOT NULL AND count(*) > count("taskTimes"."stop") THEN true
        ELSE
        false
        END AS "active",
        SUM ("taskTimes"."stop" - "taskTimes"."start") AS "duration",
        EXTRACT(EPOCH FROM (SUM("taskTimes"."stop"::timestamp - "taskTimes"."start"::timestamp))) AS "secondsDuration"
      FROM "tasks" AS "task" 
      LEFT OUTER JOIN "taskTimes" AS "taskTimes" ON "task"."id" = "taskTimes"."taskId"
      WHERE "task".id = :id
      GROUP BY "task".id;`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
    let result;
    if (tasks.length === 0) {
      const msg = CONSTANTS.messages.error.taskNotFound;
      logger.error(msg);
      throw new Error(msg);
    } else if (tasks.length != 1) {
      const msg = `[DataApi] getTask: Query for a Task returned a length != 1, ${tasks.length}`;
      logger.error(msg);
      throw new Error(msg);
    } else {
      result = tasks[0];
      logger.info(`[DataApi] getTask: ${result.id}, ${result.name}`);
    }
    return result;
  }

  async function getTaskTimes(taskId: number): Promise<TaskTimeType[]> {
    const taskTimes: TaskTimeType[] = await sequelize.query(
      `SELECT id, start, stop, EXTRACT(EPOCH FROM (stop - start)) AS "secondsDuration"
      FROM public."taskTimes"
      WHERE "taskId" = :taskid
      ORDER BY id ASC`,
      {
        replacements: { taskid: taskId },
        type: QueryTypes.SELECT,
      }
    );
    logger.info(`[DataApi] getTaskTimes: count: ${taskTimes.length}`);
    return taskTimes;
  }

  async function createTask(name: string): Promise<TaskType> {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error(CONSTANTS.messages.error.emptyTaskName);
    }

    const task: TaskType = await Task.create({ name });
    logger.info(`[DataApi] createTask: Task created: ${task.id}, ${task.name}`);
    const resultTask = await getTask(task.id);
    return resultTask;
  }

  async function deleteTask(id: number): Promise<number> {
    const task = await Task.findOne({ where: { id } });
    await task.destroy(id);
    logger.info(`[DataApi] deleteTask: Task destroyed: ${id}, ${task.name}`);
    return id;
  }

  async function changeTaskName(id: number, name: string): Promise<TaskType> {
    const result = await Task.update({ name }, { where: { id } });
    logger.info(`[DataApi] changeTaskName: Updated Task ${id} name to ${name}, count:${JSON.stringify(result)}`);
    return getTask(id);
  }

  async function closeOpenTimes(taskId: number) {
    const result = await TaskTime.update(
      {
        stop: new Date(),
      },
      {
        where: { taskId, stop: { [Op.is]: null } },
      }
    );
    // no update = [0]
    if (result[0] !== 0) {
      logger.info(
        `[DataApi] closeOpenTimes: Updated stop datetime for task ${taskId}, count:${JSON.stringify(result)}`
      );
    }
  }

  async function startTask(id: number): Promise<TaskType> {
    await closeOpenTimes(id);
    const task = await Task.findOne({ where: { id } });
    if (!task) {
      throw new Error(CONSTANTS.messages.error.taskNotFound);
    }
    await task.createTaskTime();
    logger.info(`[DataApi] startTask: New task time created for ${id}`);
    const resultTask = await getTask(task.id);
    return resultTask;
  }

  async function stopTask(id: number): Promise<TaskType> {
    await closeOpenTimes(id);
    const resultTask = await getTask(id);
    if (!resultTask) {
      throw new Error(CONSTANTS.messages.error.taskNotFound);
    }
    logger.info('[DataApi] stopTask: stopped');
    return resultTask;
  }

  return {
    getAllTasks,
    getTask,
    getTaskTimes,
    createTask,
    startTask,
    stopTask,
    deleteTask,
    changeTaskName,
  };
}

export default getDataApi;
