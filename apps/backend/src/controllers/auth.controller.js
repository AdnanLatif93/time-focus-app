const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return apiResponse.success(res, user, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return apiResponse.unauthorized(res, 'Invalid credentials');
    }

    const token = user.generateToken();
    return apiResponse.success(res, { token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};
