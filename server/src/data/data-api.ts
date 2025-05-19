import { Op, QueryTypes } from 'sequelize';
import logger from '../logging/logger';

function getDataApi(model: any, sequelize: any) {
  const { Task, TaskTime } = model;
  type TaskInstance = InstanceType<typeof Task>;
  type TaskTimeInstance = InstanceType<typeof TaskTime>;

  // async function populateTask(task: TaskInstance) {
  //   task.taskTimes = await getTaskTimes(task.id);
  //   if (task.taskTimes && task.taskTimes.length > 0) {
  //     task.secondsDuration = task.taskTimes.reduce(
  //       (total: number, current: TaskInstance) =>
  //         current.secondsDuration != null
  //           ? total + Number(current.secondsDuration)
  //           : total,
  //       0
  //     );
  //     task.active = task.taskTimes
  //       .map((tt: TaskTimeInstance) => tt.stop)
  //       .includes(null);
  //   } else {
  //     task.active = false;
  //   }
  //   return task;
  // }

  async function getAllTasks() {
    const tasks = await sequelize.query(
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

    return tasks;
  }

  async function getTask(id: number) {
    const tasks = await sequelize.query(
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
    // console.log('[getDataApi] getTask:', JSON.stringify(task, null, 2));
    let result;
    if (tasks.length != 1) {
      const msg = `Query for a Task returned a length != 1, ${tasks.length}`;
      logger.error(msg);
      throw new Error(msg);
    } else {
      result = tasks[0];
      logger.info(`Query for task returned one: (${result.id}) ${result.name}`);
    }
    return result;
  }

  // async function getTask(id: number) {
  //   const task = await Task.findOne({ where: id });
  //   await populateTask(task);
  //   return task;
  // }

  async function getTaskTimes(taskId: number) {
    const taskTimes = await sequelize.query(
      `SELECT id, start, stop, EXTRACT(EPOCH FROM (stop - start)) AS "secondsDuration"
      FROM public."taskTimes"
      WHERE "taskId" = :taskid
      ORDER BY id ASC`,
      {
        replacements: { taskid: taskId },
        type: QueryTypes.SELECT,
      }
    );
    return taskTimes;
  }

  async function createTask(name: string) {
    const task = await Task.create({ name });
    logger.info(`Task created: (${task.id}) ${task.name}`);
    const resultTask = await getTask(task.id);
    return resultTask;
  }

  async function deleteTask(id: number) {
    const task = await Task.findOne({ where: { id } });
    await task.destroy(id);
    logger.info(`Task destroyed:  (${id}) ${task.name}`);
    return id;
  }

  async function changeTaskName(id: number, name: string) {
    const task = await Task.findOne({ where: { id } });
    const oldName = task.name;
    task.name = name;
    await task.save();
    const resultTask = await getTask(task.id);
    logger.info(`Changed name from ${oldName} to ${resultTask.name}`);
    return resultTask;
  }

  async function closeOpenTimes(taskId: number) {
    const openTaskTimes = await TaskTime.findAll({
      where: { taskId, stop: { [Op.is]: null } },
    });
    openTaskTimes.every(async (taskTime: TaskTimeInstance) => {
      taskTime.stop = new Date();
      logger.info(`Added a stop datetime to task ${taskId}`);
      await taskTime.save();
    });
  }

  async function startTask(id: number) {
    await closeOpenTimes(id);
    const task = await Task.findOne({ where: { id } });
    await task.createTaskTime();
    logger.info(`New task time created for ${id}`);
    const resultTask = await getTask(task.id);
    return resultTask;
  }

  async function stopTask(id: number) {
    await closeOpenTimes(id);
    const task = await Task.findOne({ where: { id } });
    const resultTask = await getTask(task.id);
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
