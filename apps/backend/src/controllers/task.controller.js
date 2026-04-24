const taskService = require('../services/task.service');
const apiResponse = require('../utils/apiResponse');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    return apiResponse.success(res, tasks);
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return apiResponse.success(res, task, 'Task created successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    return apiResponse.success(res, task, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    return apiResponse.success(res, null, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
