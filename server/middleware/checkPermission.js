const ac = require ('../middleware/ac.js');

const checkPermission = (action, resource) => {
  return (req, res, next) => {
    // console.log('Checking permissions for:', req.user); 
    
    const userRole = req.user ? req.user.role : null;
    // console.log(userRole)
    if(!userRole) {
        console.log('checkPermission.js error');
        return res.status(401).send('Probably Unauthorized');
    }

    const permission = ac.can(userRole)[action](resource);

    if (permission.granted) {
      next();
    } else {
      res.status(403).send('Access denied.');
    }
  };
};

module.exports = checkPermission; 