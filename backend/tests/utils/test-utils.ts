export const mockAPIGatewayEvent = (overrides: any = {}): any => ({
  httpMethod: "GET",
  path: "/",
  headers: {},
  queryStringParameters: null,
  pathParameters: null,
  body: null,
  requestContext: {
    accountId: "123456789012",
    apiId: "test-api",
    protocol: "HTTP/1.1",
    httpMethod: "GET",
    path: "/",
    stage: "test",
    requestId: "test-request-id",
    requestTime: "09/Apr/2015:12:34:56 +0000",
    requestTimeEpoch: 1428582896000,
    authorizer: {
      claims: {
        sub: "test-user-id",
        email: "test@example.com",
        "cognito:username": "testuser"
      }
    }
  },
  ...overrides
});

export const mockAPIGatewayEventWithBody = (body: any, overrides: any = {}) => 
  mockAPIGatewayEvent({
    httpMethod: "POST",
    body: JSON.stringify(body),
    ...overrides
  });
