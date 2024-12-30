
const refreshToken = async (req, res, next) => 
{
  try 
  {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) 
    {
      return res.status(401).json({ error: 'Authorization Missing or Malformed.' });
    }

    const token = authHeader.split(' ')[1];

    // Attempt to Verify the Token
    let decoded;

    try 
    {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } 
    
    catch (err) 
    {
      if (err.name === 'TokenExpiredError' && req.path === '/refresh-token') 
      {
        // Allow Expired Tokens on the refresh-token Route
        decoded = jwt.decode(token);
      } 
      
      else 
      {
        throw err;
      }
    }

    // Fetch the User From the DB
    const dbUser = await prisma.users.findUnique({ where: { id: decoded.usersId } });

    if (!dbUser) 
    {
      return res.status(404).json({ error: 'User Not Found' });
    }

    req.users = dbUser;
    next();
  } 
  
  catch (err) 
  {
    console.error('Error in authenticateToken middleware:', err);
    return res.status(403).json({ error: err.name === 'JsonWebTokenError' ? 'Invalid Token.' : 'Internal Server Error.' });
  }
};

module.exports = refreshToken;