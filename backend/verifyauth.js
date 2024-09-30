import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ success: false, message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;

    next(); 
  } catch (error) {
    res.clearCookie("token");
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
