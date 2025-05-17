import { Op, QueryTypes } from 'sequelize';

function getDataApi(model: any, sequelize: any) {
  const { Task, TaskTime } = model;
  // type TaskInstance = InstanceType<typeof Task>;
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
      ORDER BY id ASC `,
      {
        replacements: { taskid: taskId },
        type: QueryTypes.SELECT,
      }
    );
    return taskTimes;
  }

  async function createTask(name: string) {
    const task = await Task.create({ name });
    return task.get({ plain: true });
  }

  async function deleteTask(id: number) {
    const task = await Task.findOne({ where: { id } });
    await task.destroy(id);
    return id;
  }

  // async function changeTaskName(id: number, name: string) {
  //   const task = await getTask(id);
  //   task.name = name;
  //   await task.save();
  //   return task;
  // }

  async function closeOpenTimes(taskId: number) {
    const openTaskTimes = await TaskTime.findAll({
      where: { taskId, stop: { [Op.is]: null } },
    });
    openTaskTimes.every(async (taskTime: TaskTimeInstance) => {
      taskTime.stop = new Date();
      await taskTime.save();
    });
  }

  async function startTask(id: number) {
    await closeOpenTimes(id);
    const task = await Task.findOne({ where: { id } });
    await task.createTaskTime();
    return task;
  }

  async function stopTask(id: number) {
    await closeOpenTimes(id);
    const task = await Task.findOne({ where: { id } });
    console.log('[getDataApi] stopTask, id', JSON.stringify(task, null, 2));
    return task;
  }

  return {
    getAllTasks,
    getTaskTimes,
    createTask,
    startTask,
    stopTask,
    deleteTask,
    // changeTaskName,
  };
}

export default getDataApi;
