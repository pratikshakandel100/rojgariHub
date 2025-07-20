import { jest } from '@jest/globals';

const Job = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  findAndCountAll: jest.fn()
};

const Employee = {};
const Application = {};
const JobSeeker = {};
const Boost = {};

const mockSave = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Job,
  Employee,
  Application,
  JobSeeker,
  Boost
}));

jest.unstable_mockModule('../../backend/config/database.js', () => ({
  default: {
    where: jest.fn(() => Symbol('where')),
    cast: jest.fn((arg, type) => `${arg}::${type}`),
    col: jest.fn((key) => key)
  }
}));

jest.unstable_mockModule('sequelize', () => {
  const Op = {
    or: Symbol('or'),
    iLike: Symbol('iLike'),
    and: Symbol('and'),
    lte: Symbol('lte'),
    gte: Symbol('gte')
  };

  const col = jest.fn((key) => key);
  const cast = jest.fn((expr, type) => `${expr}::${type}`);
  const where = jest.fn(() => Symbol('where'));

  return {
    Op,
    col,
    cast,
    where,
    default: {
      Op,
      col,
      cast,
      where
    }
  };
});


describe('Job Controller', () => {
  let createJob, getJobs, getJobById, getEmployeeJobs, updateJob, deleteJob;
  let getMockReq, getMockRes;

  beforeAll(async () => {
    ({
      createJob,
      getJobs,
      getJobById,
      getEmployeeJobs,
      updateJob,
      deleteJob
    } = await import('../../backend/controllers/jobController.js'));

    ({ getMockReq, getMockRes } = await import('@jest-mock/express'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a job successfully', async () => {
    const req = getMockReq({
      body: {
        title: 'Developer',
        description: 'Write code',
        location: 'Remote',
        type: 'Full-time',
        salary: 100000,
        requirements: 'JS,Node',
        skills: 'React',
        applicationDeadline: new Date()
      },
      user: { id: 1 },
      file: { filename: 'logo.png' }
    });
    const { res } = getMockRes();

    Job.create.mockResolvedValue({ id: 42 });
    Job.findByPk.mockResolvedValue({ title: 'Developer' });

    await createJob(req, res);

    expect(Job.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should fetch jobs with filters', async () => {
    const req = getMockReq({ query: { search: 'dev', page: '1', limit: '5' } });
    const { res } = getMockRes();

    Job.findAndCountAll.mockResolvedValue({ count: 1, rows: [{}] });

    await getJobs(req, res);

    expect(Job.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should fetch job by ID and increment views', async () => {
    const req = getMockReq({ params: { id: '42' } });
    const { res } = getMockRes();

    Job.findByPk.mockResolvedValue({ views: 1, save: mockSave });

    await getJobById(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should fetch jobs posted by employee', async () => {
    const req = getMockReq({ user: { id: 1 }, query: { page: '1', limit: '5' } });
    const { res } = getMockRes();

    Job.findAndCountAll.mockResolvedValue({ count: 1, rows: [{}] });

    await getEmployeeJobs(req, res);

    expect(Job.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should update a job successfully', async () => {
    const req = getMockReq({
      params: { id: '42' },
      body: {
        title: 'Senior Dev',
        description: 'Updated',
        requirements: 'Node,React',
        skills: 'JS',
        location: 'Remote',
        type: 'Contract',
        salary: 120000
      },
      user: { id: 1 }
    });
    const { res } = getMockRes();

    Job.findOne.mockResolvedValue({ update: mockUpdate });

    await updateJob(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('should delete a job successfully', async () => {
    const req = getMockReq({ params: { id: '42' }, user: { id: 1 } });
    const { res } = getMockRes();

    Job.findOne.mockResolvedValue({ destroy: mockDestroy });

    await deleteJob(req, res);

    expect(mockDestroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Job deleted successfully' });
  });
});
