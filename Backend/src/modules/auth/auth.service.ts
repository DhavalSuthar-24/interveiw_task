import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../../utils/connection';
import { User, UserRole, RegisterInput, LoginInput, AuthPayload } from '../../types/user.type';
import { sendOTPEmail } from '../../utils/nodemailer';

export class AuthService {
  static async registerUser(
    userData: RegisterInput, 
    role: UserRole
  ): Promise<User> {
    const { firstName, lastName, email, password } = userData;


    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (firstName, lastName, email, password, role, otp, otpExpiration, emailVerified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, role, otp, otpExpiration, false]
    );

    await sendOTPEmail(email, otp);

    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT id, firstName, lastName, email, role, emailVerified FROM users WHERE id = ?',
      [result.insertId]
    );

    return users[0] as User;
  }

  static async loginUser(
    loginData: LoginInput, 
    expectedRole: UserRole
  ): Promise<AuthPayload> {
    const { email, password } = loginData;

    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );

    const user = users[0] as User;

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.role !== expectedRole) {
      throw new Error('Unauthorized access');
    }

    const isValidPassword = await bcrypt.compare(password, user.password || '');

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' } 
    );

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    };
  }

  static async verifyEmail(otp: string, email: string): Promise<boolean> {
    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
  
    const user = users[0] as User;
  
    if (!user) {
      throw new Error('User not found');
    }


    const otpExpiration = user.otpExpiration ? new Date(user.otpExpiration) : null;
    const currentTime = new Date();
  
    if (!otpExpiration || user.otp !== otp || currentTime > otpExpiration) {
      throw new Error('Invalid or expired OTP');
    }


    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET emailVerified = TRUE, otp = NULL, otpExpiration = NULL WHERE email = ?',
      [email]
    );
  
    return result.affectedRows > 0;
  }


  static async resendVerificationEmail(email: string): Promise<boolean> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    const [users] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new Error('User not found');
    }


    await pool.execute(
      'UPDATE users SET otp = ?, otpExpiration = ? WHERE email = ?',
      [otp, otpExpiration, email]
    );


    await sendOTPEmail(email, otp);

    return true;
  }
}
