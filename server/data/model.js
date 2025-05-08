const { DataTypes } = require('sequelize');

function defineModel(sequelize) {
  const Task = sequelize.define('task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  const TaskTime = sequelize.define('taskTime', {
    start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    stop: {
      type: DataTypes.DATE,
    },
  });
  Task.hasMany(TaskTime, {
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
  });
  TaskTime.belongsTo(Task, {
    foreignKey: { allowNull: false },
    onDelete: 'CASCADE',
  });

  return { Task, TaskTime };
}

module.exports = defineModel;
