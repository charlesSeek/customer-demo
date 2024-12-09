import { validateQueryParams } from '../src/utils';
import { format } from 'date-fns';

const now = format(new Date(), "yyyy-MM-dd");

describe('validateQueryParams', () => {
  it('should validate and return default values for optional fields', async () => {
    const queryParams = {
      page: '1', 
      pageSize: '10'
    };
    const result = await validateQueryParams(queryParams);
    expect(result).toEqual({
      startDate: '1900-01-01',
      endDate: now,
      order: 'desc',
      search: '',
      page: 1,
      pageSize: 10,
    });
  });

  it('should validate and accept valid query parameters', async () => {
    const queryParams = {
      startDate: '2024-01-01',
      endDate: '2024-12-09',
      order: 'desc',
      search: 'test',
      page: '5',
      pageSize: '25',
    };

    const result = await validateQueryParams(queryParams);

    expect(result).toEqual({
      startDate: '2024-01-01',
      endDate: '2024-12-09',
      order: 'desc',
      search: 'test',
      page: 5,
      pageSize: 25,
    });
  });

  it('should throw validation error for invalid startDate and endDate formats', async () => {
    const queryParams = {
      startDate: '2023-13-01', // Invalid month
      endDate: 'not-a-date', // Invalid date format
      page: '1',
      pageSize: '10',
    };

    await expect(validateQueryParams(queryParams)).rejects.toThrow(
      'Start date must be in YYYY-MM-DD format,End date must be in YYYY-MM-DD format'
    );
  });

  it('should throw validation error for invalid order', async () => {
    const queryParams = {
      startDate: '2024-01-01',
      endDate: '2024-12-09',
      order: 'order',
      page: '1',
      pageSize: '10',
    };
    await expect(validateQueryParams(queryParams)).rejects.toThrow(
      "Order must be either 'asc' or 'desc'"
    );
  })

  it('should throw validation error for invalid page and pageSize', async () => {
    const queryParams = {
      page: 'abc', // Invalid page
      pageSize: '101', // Out of range
    };

    await expect(validateQueryParams(queryParams)).rejects.toThrow(
      "Page size cannot exceed 100,page must be a `number` type, but the final value was: `NaN` (cast from the value `\"abc\"`)."
    );
  });

  it('should strip unknown fields from the query parameters', async () => {
    const queryParams = {
      page: '3',
      pageSize: '25',
      unknownField: 'should be removed',
    };

    const result = await validateQueryParams(queryParams);

    expect(result).toEqual({
      startDate: '1900-01-01',
      endDate: now,
      order: 'desc',
      search: '',
      page: 3,
      pageSize: 25,
    });
  });
});
