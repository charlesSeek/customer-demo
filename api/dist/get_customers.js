"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const data_1 = require("./data");
const utils_1 = require("./utils");
const yup = __importStar(require("yup"));
const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Header': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
        'Content-Type': 'application/json',
    };
    try {
        const queryParams = event.queryStringParameters || {};
        // Validate query parameters
        const validatedQuery = await (0, utils_1.validateQueryParams)(queryParams);
        const { startDate, endDate, order, search, page, pageSize, } = validatedQuery;
        const filteredCustomers = data_1.data
            .filter((c) => c.fullName.toLowerCase().includes(search.toLowerCase()) &&
            c.registrationDate >= startDate &&
            c.registrationDate <= endDate);
        if (page > Math.ceil(filteredCustomers.length / pageSize) - 1) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid page parameter: exceeds total number of pages' })
            };
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
    }
    catch (error) {
        console.error('Error occurred:', JSON.stringify(error));
        if (error instanceof yup.ValidationError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: `invalid query parameters: ${error.message}` }),
            };
        }
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
exports.handler = handler;
