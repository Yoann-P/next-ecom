export const APP_NAME= "Shop next"
export const APP_DESCRIPTION= "Ecommerce-test next-js"
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"

export const signInDefaultValues = {
    email: "",
    password: ""
}

export const signUpDefaultValues = {
    name:"",
    email: "",
    password: "",
    confirmPassword: ""
}