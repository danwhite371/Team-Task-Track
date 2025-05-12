const { Op, QueryTypes } = require('sequelize');

function getDataApi(model, sequelize) {
  const { Task, TaskTime } = model;

  async function populateTask(task) {
    task.taskTimes = await getTaskTimes(task.id);
    if (task.taskTimes && task.taskTimes.length > 0) {
      task.secondsDuration = task.taskTimes.reduce(
        (accum, current) =>
          current.secondsDuration != null
            ? accum + Number(current.secondsDuration)
            : accum,
        0
      );
      task.active = task.taskTimes.map((tt) => tt.stop).includes(null);
    } else {
      task.active = false;
    }
    return task;
  }

  async function getAllTasks() {
    const tasks = await sequelize.query(
      `SELECT 
        "task"."id",
        "task"."name",
        "task"."createdAt",
        "task"."updatedAt",
        max("taskTimes"."stop") - min("taskTimes"."start") as "duration",  
        GREATEST(max("taskTimes"."start"), max("taskTimes"."stop"), "task"."updatedAt") as "lastTime",
        CASE 
          WHEN min("taskTimes"."start") IS NOT NULL AND count(*) > count("taskTimes"."stop") THEN true
        ELSE
          false
        END AS "active"
      FROM "tasks" AS "task" 
      LEFT OUTER JOIN "taskTimes" AS "taskTimes" ON "task"."id" = "taskTimes"."taskId"
      GROUP BY "task".id
      ORDER BY "lastTime" DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // for (const task of tasks) {
    //   console.log(JSON.stringify(task.duration, null, 2));
    // }

    return tasks;
  }
  /*
  async function getAllTasks() {
    const tasks = await Task.findAll({ raw: true });
    for (const task of tasks) {
      await populateTask(task);
    }

    return tasks;
  }
  */

  async function getTask(id) {
    const task = await Task.findOne({ where: id });
    await populateTask(task);
    return task;
  }

  async function getTaskTimes(taskId) {
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

  async function createTask(name) {
    const task = await Task.create({ name });
    return task.get({ plain: true });
  }

  async function deleteTask(id) {
    const task = await Task.findOne({ where: { id } });
    await task.destroy(id);
    return id;
  }

  async function changeTaskName(id, name) {
    const task = await getTask(id);
    task.name = name;
    await task.save();
    return task;
  }

  async function closeOpenTimes(taskId) {
    const openTaskTimes = await TaskTime.findAll({
      where: { taskId, stop: { [Op.is]: null } },
    });
    openTaskTimes.every(async (taskTime) => {
      taskTime.stop = new Date();
      await taskTime.save();
    });
  }

  async function startTask(taskId) {
    await closeOpenTimes(taskId);
    const task = await Task.findOne({ where: { id: taskId } });
    await task.createTaskTime();
    await populateTask(task);
    return task;
  }

  async function stopTask(taskId) {
    await closeOpenTimes(taskId);
    const task = await Task.findOne({ where: { id: taskId } });
    // await populateTask(task);
    return task;
  }

  return {
    getAllTasks,
    getTaskTimes,
    createTask,
    startTask,
    stopTask,
    deleteTask,
    changeTaskName,
  };
}

module.exports = getDataApi;
