const Task = require('../models/Task');

exports.getTasks = (userId) => Task.find({ user: userId }).sort({ createdAt: -1 });

exports.createTask = (userId, data) => Task.create({ ...data, user: userId });

exports.updateTask = (id, userId, data) =>
  Task.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });

exports.deleteTask = (id, userId) =>
  Task.findOneAndDelete({ _id: id, user: userId });
