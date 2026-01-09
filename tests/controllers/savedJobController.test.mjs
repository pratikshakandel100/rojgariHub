import { jest } from '@jest/globals';

const SavedJob = {
  findOne: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  findAndCountAll: jest.fn(),
};
const Job = {
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
};
const Employee = {
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
};
const Boost = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  SavedJob,
  Job,
  Employee,
  Boost,
}));

jest.unstable_mockModule('sequelize', () => ({
  Op: {},
}));

describe('Saved Job Controller', () => {
  let saveJob, unsaveJob, getSavedJobs, checkIfJobSaved;
  let getMockReq, getMockRes;

  beforeAll(async () => {
    ({ saveJob, unsaveJob, getSavedJobs, checkIfJobSaved } = await import('../../backend/controllers/savedJobController.js'));
    ({ getMockReq, getMockRes } = await import('@jest-mock/express'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save a job successfully', async () => {
    const req = getMockReq({ body: { jobId: 123 }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findOne.mockResolvedValue(null);
    SavedJob.create.mockResolvedValue({ id: 1, jobId: 123, jobSeekerId: 1 });

    await saveJob(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Job saved successfully',
      savedJob: expect.any(Object),
    });
  });

  it('should prevent duplicate job saves', async () => {
    const req = getMockReq({ body: { jobId: 123 }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findOne.mockResolvedValue({ id: 99 });

    await saveJob(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job already saved' });
  });

  it('should unsave a job successfully', async () => {
    const req = getMockReq({ params: { jobId: 123 }, user: { id: 1 } });
    const { res } = getMockRes();

    const mockSavedJob = { destroy: jest.fn() };
    SavedJob.findOne.mockResolvedValue(mockSavedJob);

    await unsaveJob(req, res);

    expect(mockSavedJob.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Job unsaved successfully' });
  });

  it('should return 404 if saved job not found', async () => {
    const req = getMockReq({ params: { jobId: 999 }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findOne.mockResolvedValue(null);

    await unsaveJob(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Saved job not found' });
  });

  it('should fetch saved jobs with pagination', async () => {
    const req = getMockReq({ query: { page: '1', limit: '2' }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findAndCountAll.mockResolvedValue({
      count: 2,
      rows: [
        {
          id: 1,
          savedAt: new Date(),
          job: {
            id: 100,
            title: 'Developer',
            description: 'Job desc',
            location: 'Remote',
            type: 'Full-time',
            salary: 1000,
            category: 'Engineering',
            experience: '2 yrs',
            skills: 'JavaScript',
            isRemote: true,
            createdAt: new Date(),
            employee: {
              companyName: 'Tech Corp',
              companyLogo: 'logo.png',
            },
          },
        },
      ],
    });

    await getSavedJobs(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      savedJobs: expect.any(Array),
      pagination: expect.objectContaining({
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
      }),
    }));
  });

  it('should return whether job is saved', async () => {
    const req = getMockReq({ params: { jobId: 123 }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findOne.mockResolvedValue({ id: 1 });

    await checkIfJobSaved(req, res);

    expect(res.json).toHaveBeenCalledWith({ isSaved: true });
  });

  it('should return false if job is not saved', async () => {
    const req = getMockReq({ params: { jobId: 123 }, user: { id: 1 } });
    const { res } = getMockRes();

    SavedJob.findOne.mockResolvedValue(null);

    await checkIfJobSaved(req, res);

    expect(res.json).toHaveBeenCalledWith({ isSaved: false });
  });
});
