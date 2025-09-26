import { handler } from "../src/functions/auth";

// Simple mock test
describe("Auth Lambda", () => {
  test("should handle unknown endpoint", async () => {
    const event = {
      httpMethod: "GET",
      path: "/unknown",
      body: null,
      requestContext: {}
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(404);
  });
});
