import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
    result: {
        product: {
            price: {
                compute(product) {
                    return product.price.toString();
                },
            },
            rating: {
                compute(product) {
                    return product.rating.toString();
                },
            },
        },
    },
});
