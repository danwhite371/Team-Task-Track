import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import { Sequelize } from 'sequelize';

function defineModel(sequelize: Sequelize) {
  class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
  > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
    }
  );

  class TaskTime extends Model<
    InferAttributes<TaskTime>,
    InferCreationAttributes<TaskTime>
  > {
    declare id: CreationOptional<number>;
    declare start: Date;
    declare stop: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  }

  TaskTime.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      stop: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'TaskTime',
      tableName: 'taskTimes',
    }
  );

  Task.hasMany(TaskTime, {
    foreignKey: 'taskId',
    as: 'taskTimes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  TaskTime.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task',
  });

  return { Task, TaskTime };
}

export default defineModel;
