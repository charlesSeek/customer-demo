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
exports.validateQueryParams = void 0;
const yup = __importStar(require("yup"));
const date_fns_1 = require("date-fns");
const now = (0, date_fns_1.format)(new Date(), "yyyy-MM-dd");
const querySchema = yup.object().shape({
    startDate: yup
        .string()
        .optional()
        .default('1900-01-01')
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "Start date must be in YYYY-MM-DD format"),
    endDate: yup
        .string()
        .optional()
        .default(now)
        .matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "End date must be in YYYY-MM-DD format"),
    order: yup
        .string()
        .optional()
        .oneOf(["asc", "desc"], "Order must be either 'asc' or 'desc'")
        .default("desc"),
    search: yup
        .string()
        .optional()
        .default(''),
    page: yup
        .number()
        .transform((_, originalValue) => originalValue ? Number(originalValue) : 0).required("Page is required")
        .integer("Page must be an integer")
        .min(0, "Page must be at least 0"),
    pageSize: yup
        .number()
        .transform((_, originalValue) => originalValue ? Number(originalValue) : 10).required("pageSize is a required")
        .integer("Page size must be an integer")
        .min(5, "Page size must be at least 5")
        .max(100, "Page size cannot exceed 100"),
});
const validateQueryParams = async (queryParams) => {
    try {
        return await querySchema.validate(queryParams, {
            abortEarly: false, // Collect all validation errors
            stripUnknown: true, // Remove fields not in the schema
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            const errorMessage = error.inner.map(err => err.message).join(',');
            throw new yup.ValidationError(errorMessage);
        }
        throw error;
    }
};
exports.validateQueryParams = validateQueryParams;
