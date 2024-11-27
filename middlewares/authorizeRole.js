
// Users Type Privileges
const authorizeRole = (allowedRoles) => (req, res, next) => 
{
    try
    {
        if (!allowedRoles.includes(req.users.usersType)) 
        {
            return res.status(403).json({ error: 'Access Denied: Insufficient Privileges' });
        }

        next();
    }
     
    catch (err) 
    {
    res.status(500).json({ error: 'Authorization failed', details: err.message });
    }
};

module.exports = authorizeRole;