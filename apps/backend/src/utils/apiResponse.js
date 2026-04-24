exports.success = (res, data, message = 'Success') =>
  res.status(200).json({ success: true, message, data });

exports.unauthorized = (res, message = 'Unauthorized') =>
  res.status(401).json({ success: false, message });

exports.error = (res, message = 'Error', status = 500) =>
  res.status(status).json({ success: false, message });
