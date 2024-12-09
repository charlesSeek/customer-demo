import { 
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  APIGatewayProxyEvent
} from 'aws-lambda';
import { Customer } from './types';
import { data } from './data';
import { validateQueryParams } from "./utils";
import * as yup from "yup";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Header': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
    'Content-Type': 'application/json',
  }
  try {
    const queryParams = event.queryStringParameters || {};

    // Validate query parameters
    const validatedQuery = await validateQueryParams(queryParams);
    const {
      startDate, endDate, order, search, page, pageSize,
    } = validatedQuery

    const filteredCustomers: Customer[] = data
    .filter((c: Customer) => 
      c.fullName.toLowerCase().includes(search.toLowerCase()) &&
      c.registrationDate >= startDate &&
      c.registrationDate <= endDate 
    );

    if (page > Math.ceil(filteredCustomers.length / pageSize) - 1) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid page parameter: exceeds total number of pages' })
      }
    } 
    
    const sortedPaginationCustomers = filteredCustomers
    .sort((a, b) => (a.registrationDate > b.registrationDate ? 1 : -1) * (order === 'desc' ? -1 : 1))
    .slice(page * pageSize, (page + 1) * pageSize);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items: sortedPaginationCustomers,
        total: filteredCustomers.length,
        totalPage: Math.ceil(filteredCustomers.length / pageSize)
      }),
    };
  } catch (error) {
    console.error('Error occurred:', JSON.stringify(error));
    if (error instanceof yup.ValidationError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `invalid query parameters: ${error.message}` }),
      }
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
