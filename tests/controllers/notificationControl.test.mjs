import { jest } from '@jest/globals';

const Notification = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAndCountAll: jest.fn(),
  count: jest.fn(),
  update: jest.fn()
};

const Admin = {
  findByPk: jest.fn()
};

const Employee = {
  findByPk: jest.fn()
};

const JobSeeker = {
  findByPk: jest.fn()
};

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Notification,
  Admin,
  Employee,
  JobSeeker
}));

describe('Notification Controller', () => {
  let createNotification,
      getNotifications,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      deleteNotification,
      getUserProfile;

  let getMockReq, getMockRes;

  beforeAll(async () => {
    ({
      createNotification,
      getNotifications,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      deleteNotification,
      getUserProfile
    } = await import('../../backend/controllers/notificationController.js'));

    ({ getMockReq, getMockRes } = await import('@jest-mock/express'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a notification', async () => {
    Notification.create.mockResolvedValue({ id: 1 });
    const result = await createNotification(1, 'employee', 'message', 'Hello', 'You have a new update');
    expect(Notification.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should fetch notifications', async () => {
    const req = getMockReq({
      user: { id: 1 },
      userType: 'employee',
      query: { page: '1', limit: '2' }
    });
    const { res } = getMockRes();

    Notification.findAndCountAll.mockResolvedValue({ count: 1, rows: [{}] });

    await getNotifications(req, res);

    expect(Notification.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      notifications: expect.any(Array)
    }));
  });

  it('should mark a notification as read', async () => {
    const req = getMockReq({
      params: { notificationId: '10' },
      user: { id: 1 },
      userType: 'employee'
    });
    const { res } = getMockRes();

    const mockNotification = { update: jest.fn() };
    Notification.findOne.mockResolvedValue(mockNotification);

    await markAsRead(req, res);

    expect(mockNotification.update).toHaveBeenCalledWith({ isRead: true });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Notification marked as read' });
  });

  it('should mark all notifications as read', async () => {
    const req = getMockReq({ user: { id: 1 }, userType: 'employee' });
    const { res } = getMockRes();

    Notification.update.mockResolvedValue([1]);

    await markAllAsRead(req, res);

    expect(Notification.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'All notifications marked as read' });
  });

  it('should fetch unread count', async () => {
    const req = getMockReq({ user: { id: 1 }, userType: 'employee' });
    const { res } = getMockRes();

    Notification.count.mockResolvedValue(3);

    await getUnreadCount(req, res);

    expect(Notification.count).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, unreadCount: 3 });
  });

  it('should delete a notification', async () => {
    const req = getMockReq({ params: { notificationId: '10' }, user: { id: 1 }, userType: 'employee' });
    const { res } = getMockRes();

    const mockNotification = { destroy: jest.fn() };
    Notification.findOne.mockResolvedValue(mockNotification);

    await deleteNotification(req, res);

    expect(mockNotification.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Notification deleted successfully' });
  });

  it('should fetch user profile as admin', async () => {
    const req = getMockReq({ user: { id: 1 }, userType: 'admin' });
    const { res } = getMockRes();

    Admin.findByPk.mockResolvedValue({ toJSON: () => ({ id: 1, name: 'Admin', email: 'admin@example.com' }) });

    await getUserProfile(req, res);

    expect(Admin.findByPk).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should fetch user profile as employee', async () => {
    const req = getMockReq({ user: { id: 2 }, userType: 'employee' });
    const { res } = getMockRes();

    Employee.findByPk.mockResolvedValue({ toJSON: () => ({ id: 2, name: 'Emp', email: 'emp@example.com', companyName: 'Tech' }) });

    await getUserProfile(req, res);

    expect(Employee.findByPk).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should fetch user profile as jobseeker', async () => {
    const req = getMockReq({ user: { id: 3 }, userType: 'jobseeker' });
    const { res } = getMockRes();

    JobSeeker.findByPk.mockResolvedValue({ toJSON: () => ({ id: 3, name: 'JS', email: 'js@example.com' }) });

    await getUserProfile(req, res);

    expect(JobSeeker.findByPk).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
