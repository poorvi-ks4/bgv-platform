export const requireRole = (roles = []) => (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const userRole = user.role || user.customClaims?.role;
  if (!roles.length || roles.includes(userRole)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

export default requireRole;
