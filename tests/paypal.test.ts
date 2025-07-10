import {generateAccessToken, paypal} from "../lib/paypal";


// Generate test for paypal access token
test("Generate paypal access token", async () => {
    const accessToken = await generateAccessToken()
    console.log(accessToken)
    expect(typeof accessToken).toBe("string")
    expect(accessToken.length).toBeGreaterThan(0)
})

// Test to create a paypal order
test("create paypal order", async () => {
    const token = await generateAccessToken()
   const price = 10.0

    const orderResponse = await paypal.createOrder(price)
    console.log(orderResponse)

    expect(orderResponse).toHaveProperty("id")
    expect(orderResponse).toHaveProperty("status")
    expect(orderResponse.status).toBe("CREATED")
})

// Test to capture a paypal paiement with a mock
test("capture payment", async ()=> {
    const orderId = "100"

    const mockCapturePayment = jest
        .spyOn(paypal, "capturePayment")
        .mockResolvedValue({
            status: "COMPLETED"
        })

    const captureResponse = await paypal.capturePayment(orderId)
    expect(captureResponse).toHaveProperty("status", "COMPLETED")

    mockCapturePayment.mockRestore()
})