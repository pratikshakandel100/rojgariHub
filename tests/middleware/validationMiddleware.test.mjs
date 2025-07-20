import { jest } from '@jest/globals';

describe('Validation Helpers Only', () => {
  let customValidators, sanitizers, commonValidations;

  beforeAll(async () => {
    const validationModule = await import('../../backend/middleware/validation.js');
    customValidators = validationModule.customValidators;
    sanitizers = validationModule.sanitizers;
    commonValidations = validationModule.commonValidations;
  });

  it('validates a strong password', () => {
    expect(customValidators.isStrongPassword('weakpass')).toBe(false);
    expect(customValidators.isStrongPassword('Strong1!Pass')).toBe(true);
  });

  it('sanitizes HTML and trims', () => {
    expect(sanitizers.stripHtml('<b>Test</b>')).toBe('Test');
    expect(sanitizers.normalizeText('  Hello   world  ')).toBe('Hello world');
  });

  it('converts to title case', () => {
    expect(sanitizers.toTitleCase('hello world')).toBe('Hello World');
  });

  it('validates experience and job type', () => {
    expect(customValidators.isValidExperienceLevel('Executive')).toBe(true);
    expect(customValidators.isValidJobType('Full Time')).toBe(true);
    expect(customValidators.isValidJobType('Temporary')).toBe(false);
  });

  it('validates salary range', () => {
    expect(customValidators.isValidSalaryRange('30000-60000')).toBe(true);
    expect(customValidators.isValidSalaryRange('30k - 60k')).toBe(false);
  });

  it('validates past and future date checks', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000).toISOString();
    const future = new Date(now.getTime() + 86400000).toISOString();

    expect(customValidators.isPastDate(past)).toBe(true);
    expect(customValidators.isFutureDate(future)).toBe(true);
  });

  it('validates skills array format', () => {
    expect(customValidators.isValidSkillsArray(['React', 'Node'])).toBe(true);
    expect(customValidators.isValidSkillsArray(['', null])).toBe(false);
  });
});
