import * as yup from "yup";
import { format } from "date-fns";

const now = format(new Date(), "yyyy-MM-dd");

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
    .transform((_: number, originalValue: string) =>
      originalValue ? Number(originalValue) : 0
    ).required("Page is required")
    .integer("Page must be an integer")
    .min(0, "Page must be at least 0"),
  pageSize: yup
    .number()
    .transform((_: number, originalValue: string) =>
      originalValue ? Number(originalValue) : 10
    ).required("pageSize is a required")
    .integer("Page size must be an integer")
    .min(5, "Page size must be at least 5")
    .max(100, "Page size cannot exceed 100"),
});

export const validateQueryParams = async (
  queryParams: Record<string, any>
) => {
  try {
    return await querySchema.validate(queryParams, {
      abortEarly: false, // Collect all validation errors
      stripUnknown: true, // Remove fields not in the schema
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errorMessage = error.inner.map(err => err.message).join(',');
      throw new yup.ValidationError(errorMessage);
    }
    throw error;
  }
}