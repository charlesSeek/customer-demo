import { mockData } from './mockData';
jest.mock('../src/data', () => ({
  data: mockData,
}))
import { handler } from '../src/get_customers'; 
import { 
  APIGatewayProxyEvent, 
  Context,
  APIGatewayProxyResult
} from 'aws-lambda';
import * as utils from '../src/utils';
import * as yup from "yup";

jest.mock('../src/utils');
const mockValidateQueryParams = utils.validateQueryParams as jest.Mock;

describe('get_customers lambda function handler', () => {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    queryStringParameters: {
      startDate: '2024-01-01',
      endDate: '2024-12-09',
      search: '',
      page: '0',
      pageSize: '10',
    },
  };
  const mockContext: Partial<Context> = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return  customers when valid query parameters are provided', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;

    mockValidateQueryParams.mockResolvedValue({
      startDate: '2023-01-01',
      endDate: '2024-12-09',
      order: 'desc',
      search: '',
      page: 0,
      pageSize: 10,
    });
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).total).toBe(16);
    expect(JSON.parse(result.body).items.length).toBe(10)
    expect(JSON.parse(result.body).totalPage).toBe(2);
  });

  it('should return customers when page is last page', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;

    mockValidateQueryParams.mockResolvedValue({
      startDate: '2023-01-01',
      endDate: '2024-12-09',
      order: 'desc',
      search: '',
      page: 1,
      pageSize: 10,
    });
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).total).toBe(16);
    expect(JSON.parse(result.body).items.length).toBe(6);
    expect(JSON.parse(result.body).totalPage).toBe(2);
    expect(JSON.parse(result.body).items[0]).toEqual({
      "id": "caca1581-7605-4379-a105-ea9bd3842d3d",
      "fullName": "Ruben Dufore",
      "email": "rdufore4@icio.us",
      "registrationDate": "2024-06-18T04:14:36Z"
    });
    expect(JSON.parse(result.body).items[5]).toEqual({
      "id": "f76bca2b-e1a6-48c9-928b-88563927f51e",
      "fullName": "Nananne Eversley",
      "email": "neversleye@zimbio.com",
      "registrationDate": "2024-02-09T21:39:45Z"
    });
  });

  it('should return asc customers when order is asc', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;

    mockValidateQueryParams.mockResolvedValue({
      startDate: '2023-01-01',
      endDate: '2024-12-09',
      order: 'asc',
      search: '',
      page: 1,
      pageSize: 10,
    });
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;
    expect(JSON.parse(result.body).total).toBe(16);
    expect(JSON.parse(result.body).items.length).toBe(6);
    expect(JSON.parse(result.body).totalPage).toBe(2);
    expect(JSON.parse(result.body).items[0]).toEqual({
      "id": "5a0c9ce3-0e65-42e1-9186-6f46f5d92202",
      "fullName": "Sula Baudry",
      "email": "sbaudry9@salon.com",
      "registrationDate": "2024-07-20T11:01:35Z"
    });
    expect(JSON.parse(result.body).items[5]).toEqual({
      "id": "3025afa4-a144-4d5d-9bb6-8a44279aaaac",
      "fullName": "Bobette Nesterov",
      "email": "bnesterovc@canalblog.com",
      "registrationDate": "2024-11-22T04:49:29Z"
    });
  });

  it('should return error when page is large last page', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;

    mockValidateQueryParams.mockResolvedValue({
      startDate: '2023-01-01',
      endDate: '2024-12-09',
      order: 'desc',
      search: '',
      page: 2,
      pageSize: 10,
    });
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Invalid page parameter: exceeds total number of pages',
    });
  });

  it('should return 400 for invalid query parameters', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    mockValidateQueryParams.mockRejectedValue(new yup.ValidationError('Invalid order'));
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'invalid query parameters: Invalid order',
    });
  });

  it('should return 500 for unexpected errors', async () => {
    const event: APIGatewayProxyEvent = {
      ...mockEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    mockValidateQueryParams.mockRejectedValue(new Error('unexpected error'));
    const result = await handler(event, mockContext as Context, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Internal Server Error',
    });
  });

});
