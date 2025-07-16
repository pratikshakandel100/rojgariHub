import { PasswordReset, Admin, Employee, JobSeeker } from '../models/index.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

// Configure email transporter (you'll need to set up your email service)
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Find user by email across all user types
const findUserByEmail = async (email) => {
  let user = await Admin.findOne({ where: { email } });
  if (user) return { user, userType: 'Admin' };

  user = await Employee.findOne({ where: { email } });
  if (user) return { user, userType: 'Employee' };

  user = await JobSeeker.findOne({ where: { email } });
  if (user) return { user, userType: 'JobSeeker' };

  return null;
};

// Send password reset email
export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user across all user types
    const userResult = await findUserByEmail(email);
    if (!userResult) {
      return res.status(404).json({ message: 'User not found with this email address' });
    }

    const { user, userType } = userResult;

    // Check if there's already a recent password reset request
    const existingReset = await PasswordReset.findOne({
      where: {
        email,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (existingReset) {
      // Check if it was created less than 5 minutes ago
      const timeDiff = new Date() - new Date(existingReset.createdAt);
      if (timeDiff < 5 * 60 * 1000) { // 5 minutes
        return res.status(429).json({ 
          message: 'Password reset email already sent. Please wait 5 minutes before requesting again.' 
        });
      }
    }

    // Create new password reset record
    const passwordReset = await PasswordReset.create({
      email,
      userType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Send email
    const transporter = createEmailTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${passwordReset.token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@rojgarhub.com',
      to: email,
      subject: 'Password Reset Request - RojgarHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>We received a request to reset your password for your RojgarHub account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This email was sent from RojgarHub. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Password reset email sent successfully. Please check your inbox.',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
    });
  } catch (error) {
    console.error('Send password reset email error:', error);
    res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
  }
};

// Resend password reset email
export const resendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the most recent unused password reset request
    const passwordReset = await PasswordReset.findOne({
      where: {
        email,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!passwordReset) {
      return res.status(404).json({ message: 'No active password reset request found. Please request a new one.' });
    }

    // Check if it was created less than 2 minutes ago
    const timeDiff = new Date() - new Date(passwordReset.createdAt);
    if (timeDiff < 2 * 60 * 1000) { // 2 minutes
      return res.status(429).json({ 
        message: 'Please wait 2 minutes before requesting to resend the email.' 
      });
    }

    // Find user
    const userResult = await findUserByEmail(email);
    if (!userResult) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { user } = userResult;

    // Resend email
    const transporter = createEmailTransporter();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${passwordReset.token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@rojgarhub.com',
      to: email,
      subject: 'Password Reset Request (Resent) - RojgarHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request (Resent)</h2>
          <p>Hello ${user.firstName},</p>
          <p>Here's your password reset link again:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This email was sent from RojgarHub. Please do not reply to this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Password reset email resent successfully. Please check your inbox.',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    });
  } catch (error) {
    console.error('Resend password reset email error:', error);
    res.status(500).json({ message: 'Failed to resend password reset email. Please try again later.' });
  }
};

// Verify password reset token
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const passwordReset = await PasswordReset.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    res.json({ 
      message: 'Token is valid',
      email: passwordReset.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      userType: passwordReset.userType
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find password reset record
    const passwordReset = await PasswordReset.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Find user
    const userResult = await findUserByEmail(passwordReset.email);
    if (!userResult) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { user, userType } = userResult;

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await user.update({ password: hashedPassword });

    // Mark password reset as used
    await passwordReset.markAsUsed();

    // Invalidate all other password reset tokens for this email
    await PasswordReset.update(
      { isUsed: true },
      {
        where: {
          email: passwordReset.email,
          isUsed: false,
          id: { [Op.ne]: passwordReset.id }
        }
      }
    );

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get password reset history (Admin only)
export const getPasswordResetHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, email, userType } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (email) {
      whereClause.email = { [Op.iLike]: `%${email}%` };
    }
    if (userType) {
      whereClause.userType = userType;
    }

    const passwordResets = await PasswordReset.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'email', 'userType', 'isUsed', 'usedAt', 'expiresAt', 'ipAddress', 'createdAt'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      passwordResets: passwordResets.rows,
      totalCount: passwordResets.count,
      totalPages: Math.ceil(passwordResets.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get password reset history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};