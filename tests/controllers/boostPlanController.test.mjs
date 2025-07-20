import { jest } from '@jest/globals';

const BoostPlan = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn()
};

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  BoostPlan
}));

jest.unstable_mockModule('sequelize', () => ({
  Op: {}
}));

describe('Boost Plan Controller', () => {
  let createBoostPlan,
      getAllBoostPlans,
      getBoostPlanById,
      updateBoostPlan,
      deleteBoostPlan,
      toggleBoostPlanStatus,
      getActiveBoostPlansForEmployees;

  let getMockReq, getMockRes;

  beforeAll(async () => {
    ({
      createBoostPlan,
      getAllBoostPlans,
      getBoostPlanById,
      updateBoostPlan,
      deleteBoostPlan,
      toggleBoostPlanStatus,
      getActiveBoostPlansForEmployees
    } = await import('../../backend/controllers/boostPlanController.js'));

    ({ getMockReq, getMockRes } = await import('@jest-mock/express'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a boost plan', async () => {
    const req = getMockReq({
      body: {
        name: 'Premium',
        type: 'Gold',
        duration: 30,
        price: 99,
        badge: '🔥',
        description: 'Top tier plan'
      }
    });
    const { res } = getMockRes();

    BoostPlan.create.mockResolvedValue({ id: 1 });

    await createBoostPlan(req, res);

    expect(BoostPlan.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Premium' }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should get all boost plans', async () => {
    const req = getMockReq({ query: {} });
    const { res } = getMockRes();

    BoostPlan.findAll.mockResolvedValue([]);

    await getAllBoostPlans(req, res);

    expect(BoostPlan.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, boostPlans: [] });
  });

  it('should get boost plan by ID', async () => {
    const req = getMockReq({ params: { id: '5' } });
    const { res } = getMockRes();

    BoostPlan.findByPk.mockResolvedValue({ id: 5 });

    await getBoostPlanById(req, res);

    expect(BoostPlan.findByPk).toHaveBeenCalledWith('5');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should update a boost plan', async () => {
    const req = getMockReq({
      params: { id: '5' },
      body: { price: 199 }
    });
    const { res } = getMockRes();

    const mockUpdate = jest.fn();
    BoostPlan.findByPk.mockResolvedValue({ update: mockUpdate });

    await updateBoostPlan(req, res);

    expect(mockUpdate).toHaveBeenCalledWith({ price: 199 });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Boost plan updated successfully' }));
  });

  it('should delete a boost plan', async () => {
    const req = getMockReq({ params: { id: '5' } });
    const { res } = getMockRes();

    const mockDestroy = jest.fn();
    BoostPlan.findByPk.mockResolvedValue({ destroy: mockDestroy });

    await deleteBoostPlan(req, res);

    expect(mockDestroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Boost plan deleted successfully' });
  });

  it('should toggle boost plan status', async () => {
    const req = getMockReq({ params: { id: '5' } });
    const { res } = getMockRes();

    const mockUpdate = jest.fn();
    BoostPlan.findByPk.mockResolvedValue({ isActive: false, update: mockUpdate });

    await toggleBoostPlanStatus(req, res);

    expect(mockUpdate).toHaveBeenCalledWith({ isActive: true });
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should get active boost plans for employees', async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    BoostPlan.findAll.mockResolvedValue([{ name: 'Premium' }]);

    await getActiveBoostPlansForEmployees(req, res);

    expect(BoostPlan.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['price', 'ASC']]
    }));
    expect(res.json).toHaveBeenCalledWith({ success: true, boostPlans: [{ name: 'Premium' }] });
  });
});
