const authenticate = async (req, res, next) => {
  req.user = { _id: '000000000000000000000000', id: '000000000000000000000000', name: 'Demo User', email: 'demo@example.com', role: 'admin' };
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

module.exports = { authenticate, authorize };
