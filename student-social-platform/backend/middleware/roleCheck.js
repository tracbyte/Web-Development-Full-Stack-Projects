// mainly here for moderation actions later (removing reported posts etc.)
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed to perform this action' });
    }
    next();
  };
};

module.exports = roleCheck;
