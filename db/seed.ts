import {PrismaClient} from '@prisma/client'
import sampleData from "@/db/sample-data";

async function main() {

    const prisma = new PrismaClient()
    await prisma.product.deleteMany()

    await prisma.product.createMany({
        data: sampleData.products
    })
    await prisma.$disconnect()

    console.log("Database seeded successfully")
}

main()