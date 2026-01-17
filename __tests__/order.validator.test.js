import { validateCreateOrder } from "../validators/order.validator.js";

describe("Order Validator - createOrder", () => {

    it("should pass for valid order data", () => {
        const validOrder = {
            productId: "prod-123",
            quantity: 2,
            amount: 500
        };

        const { error } = validateCreateOrder(validOrder);

        expect(error).toBeUndefined();
    });

    it("should fail if productId is missing", () => {
        const invalidOrder = {
            quantity: 2,
            amount: 500
        };

        const { error } = validateCreateOrder(invalidOrder);

        expect(error).toBeDefined();
    });

    it("should fail if amount is negative", () => {
        const invalidOrder = {
            productId: "prod-123",
            quantity: 2,
            amount: -100
        };

        const { error } = validateCreateOrder(invalidOrder);

        expect(error).toBeDefined();
    });

    it("should fail if quantity is not a number", () => {
        const invalidOrder = {
            productId: "prod-123",
            quantity: "two",
            amount: 500
        };

        const { error } = validateCreateOrder(invalidOrder);

        expect(error).toBeDefined();
    });

});