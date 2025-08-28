import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSecretKey = process.env.ADMIN_SECRET_KEY || process.env.SECRET_KEY + '_ADMIN';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateAdminToken = (admin) => {
  return jwt.sign({ 
    id: admin.id, 
    username: admin.username, 
    type: 'admin' 
  }, adminSecretKey, {
    expiresIn: "24h",
  });
};

export const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, adminSecretKey);
    if (decoded.type !== 'admin') {
      throw new Error('Invalid admin token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid admin token');
  }
};