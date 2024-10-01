import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  
  const authHeader = req.headers['authorization']; 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(404).json({ success: false, message: "No token, authorization denied" });
  }

  // Extract the token part (remove 'Bearer ')
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(404).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next(); 
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
