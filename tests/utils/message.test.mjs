
import { success, failure } from '../../backend/utils/message.js'; // adjust this path based on actual location

describe('Response Helpers', () => {
  it('returns a success response with default values', () => {
    const result = success();
    expect(result.success).toBe(true);
    expect(result.message).toBe('Success');
    expect(result.data).toStrictEqual({});
  });

  it('returns a success response with custom values', () => {
    const result = success('Created', { id: 1 });
    expect(result.success).toBe(true);
    expect(result.message).toBe('Created');
    expect(result.data).toStrictEqual({ id: 1 });
  });

  it('returns a failure response with default message', () => {
    const result = failure();
    expect(result.success).toBe(false);
    expect(result.message).toBe('Something Went Wrong');
  });

  it('returns a failure response with custom message', () => {
    const result = failure('Unauthorized');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Unauthorized');
  });
});
