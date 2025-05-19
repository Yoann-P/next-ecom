"use server"


import {convertToPlainObject} from "@/lib/utils";
import {LATEST_PRODUCTS_LIMIT} from "@/lib/constants";
import {prisma} from "@/db/prisma";



// Get Latest Products
export async function getLatestProducts() {

    try {
        const data = await prisma.product.findMany({
            take: LATEST_PRODUCTS_LIMIT,
            orderBy: {
                createdAt: "desc"
            }
        })
        return convertToPlainObject(data)

    } catch (error) {
        console.error("Erreur lors de la recupération de produits:", error);
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
    }

}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
    try {
        const data = await prisma.product.findFirst({
            where: {
                slug: slug
            }
        })
        return convertToPlainObject(data)
    } catch (error) {
        console.log("Erreur lors de la recupération de produit:", error)
    }
}
