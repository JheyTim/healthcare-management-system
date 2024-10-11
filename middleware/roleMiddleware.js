const roleMiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (requiredRoles.length && !requiredRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'Access forbidden: Insufficient role' });
    }
    next();
  };
};

module.exports = roleMiddleware