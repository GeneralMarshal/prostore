import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
//format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod Error
    const fieldErrors = Object.keys(error.issues).map((field) => {
      return error.issues[field].message;
    });
    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma Error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    //Handle Other Errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === "number"){
    return Math.round(( value + Number.EPSILON) * 100)/100
  } else if (typeof value === "string"){
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is neither a number or a string")
  }
}

// Currency formatter
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US",{
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
})

// Format Currency
export function formatCurrency( amount: number | string | null){
  if(typeof amount === "string"){
    return CURRENCY_FORMATTER.format(Number(amount))
  }
  if(typeof amount === "number"){
    return CURRENCY_FORMATTER.format(amount)
  } else{
    return NaN
  }
}
