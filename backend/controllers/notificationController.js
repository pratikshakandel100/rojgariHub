import { Notification, Employee, JobSeeker, Admin } from '../models/index.js';

export const createNotification = async (recipientId, recipientType, type, title, message, senderId = null, senderType = null, relatedEntityId = null, relatedEntityType = null) => {
  try {
    const notification = await Notification.create({
      recipientId,
      recipientType,
      senderId,
      senderType,
      type,
      title,
      message,
      relatedEntityId,
      relatedEntityType
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { user, userType } = req;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {
      recipientId: user.id,
      recipientType: userType
    };
    
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }
    
    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      notifications: notifications.rows,
      totalCount: notifications.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(notifications.count / limit)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { user, userType } = req;
    
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        recipientId: user.id,
        recipientType: userType
      }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.update({ isRead: true });
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const { user, userType } = req;
    
    await Notification.update(
      { isRead: true },
      {
        where: {
          recipientId: user.id,
          recipientType: userType,
          isRead: false
        }
      }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read'
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const { user, userType } = req;
    
    const count = await Notification.count({
      where: {
        recipientId: user.id,
        recipientType: userType,
        isRead: false
      }
    });
    
    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { user, userType } = req;
    
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        recipientId: user.id,
        recipientType: userType
      }
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    await notification.destroy();
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { user, userType } = req;
    let userProfile;
    
    switch (userType) {
      case 'admin':
        userProfile = await Admin.findByPk(user.id, {
          attributes: ['id', 'name', 'email']
        });
        break;
      case 'employee':
        userProfile = await Employee.findByPk(user.id, {
          attributes: ['id', 'name', 'email', 'companyName']
        });
        break;
      case 'jobseeker':
        userProfile = await JobSeeker.findByPk(user.id, {
          attributes: ['id', 'name', 'email']
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        ...userProfile.toJSON(),
        role: userType
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};