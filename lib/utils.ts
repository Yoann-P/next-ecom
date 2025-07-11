import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

//convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}

//Format number with decimals places
export function formatNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.')
    return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`
}

// Format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export  function formatError(error: any) {
    if (error.name === "ZodError") {
        //Handle ZodError
        const fieldErrors = Object.keys(error.errors).map((field)=> error.errors[field].message)

        return fieldErrors.join(". ")
    } else if (error.name === "PrismaClientKnownRequestError" && error.code === "P2002") {
        //Handle Prisma error
        const field = error.meta?.target ? error.meta.target[0] : "Field"
        return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    } else {
        //Handle other errors
        return typeof error.message === "string" ? error.message : JSON.stringify(error.message)
    }
}

//Round number to 2 decimal places
export function round2(value: number | string) {
    let num: number;
    if (typeof value === 'number') {
        num = value;
    } else if (typeof value === 'string') {
        num = Number(value);
        if (isNaN(num)) {
            throw new Error('Value string is not a valid number');
        }
    } else {
        throw new Error('Value must be a number or string');
    }
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Formatter pour l'affichage en euros selon la convention française
const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
    currency: 'EUR',
    style: 'currency',
    minimumFractionDigits: 2
});

export function formatCurrency(amount: number|string|null) {
if(typeof amount === 'number') {
    return CURRENCY_FORMATTER.format(amount)
} else if (typeof amount === 'string') {
    return CURRENCY_FORMATTER.format(Number(amount))
} else {
    return "NAN"
}
}

// Shorted UUID
export function formatId(id:string){
    return `..${id.substring(id.length-6)}`
}

// Format date and time
export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // abbreviated month name (e.g., 'Oct')
        day: 'numeric', // numeric day of the month (e.g., '25')
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
        month: 'short', // abbreviated month name (e.g., 'Oct')
        year: 'numeric', // numeric year (e.g., '2023')
        day: 'numeric', // numeric day of the month (e.g., '25')
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', // numeric hour (e.g., '8')
        minute: 'numeric', // numeric minute (e.g., '30')
        hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
    };
    const formattedDateTime: string = new Date(dateString).toLocaleString(
        'fr-FR',
        dateTimeOptions
    );
    const formattedDate: string = new Date(dateString).toLocaleString(
        'fr-FR',
        dateOptions
    );
    const formattedTime: string = new Date(dateString).toLocaleString(
        'fr-FR',
        timeOptions
    );
    return {
        dateTime: formattedDateTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    };
};