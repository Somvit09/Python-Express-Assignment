function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Not an admin user, please login with admin credentials to perform delete operations."
      }); // Forbidden
    }
    next();
  }
  module.exports = requireAdmin;
  