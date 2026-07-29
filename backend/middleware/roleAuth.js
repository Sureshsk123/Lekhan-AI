export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errors: [{ field: 'auth', message: 'User not authenticated' }]
      });
    }

    const userRole = req.user.role || 'user';
    if (!roles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of the following roles: ${roles.join(', ')}`,
        errors: [{ field: 'role', message: 'Insufficient permission for this resource' }]
      });
    }

    next();
  };
};

export default requireRole;
