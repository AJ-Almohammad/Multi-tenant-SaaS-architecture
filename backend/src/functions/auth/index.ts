import { APIGatewayEvent } from "../../shared/types";
import { ResponseHelper } from "../../shared/utils/response-helper";
import { DynamoDBHelper } from "../../shared/utils/dynamodb-helper";
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from "uuid";

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_REGION || "eu-central-1" 
});

export const handler = async (event: APIGatewayEvent) => {
  try {
    const { httpMethod, path } = event;
    const route = `${httpMethod} ${path}`;

    console.log("Auth function called:", route);

    switch (route) {
      case "POST /auth/register":
        return await registerUser(event);
      case "POST /auth/login":
        return await loginUser(event);
      default:
        return ResponseHelper.error("Endpoint not found", 404);
    }
  } catch (error) {
    console.error("Auth function error:", error);
    return ResponseHelper.error("Internal server error", 500);
  }
};

async function registerUser(event: APIGatewayEvent) {
  const body = JSON.parse(event.body || "{}");
  const { email, name, password } = body;

  if (!email || !name || !password) {
    return ResponseHelper.error("Email, name, and password are required", 400);
  }

  try {
    const userId = uuidv4();

    // Register user in Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID!,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
        { Name: "custom:userId", Value: userId },
      ],
    });

    await cognitoClient.send(signUpCommand);

    // Create user profile in DynamoDB
    const userProfile = {
      PK: `USER#${userId}`,
      SK: "PROFILE",
      userId,
      email,
      name,
      subscription: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await DynamoDBHelper.putItem(process.env.USERS_TABLE!, userProfile);

    return ResponseHelper.success({ 
      message: "User registered successfully",
      userId 
    }, 201);
  } catch (error: any) {
    if (error.name === "UsernameExistsException") {
      return ResponseHelper.error("User already exists", 409);
    }
    return ResponseHelper.error("Registration failed: " + error.message, 400);
  }
}

async function loginUser(event: APIGatewayEvent) {
  const body = JSON.parse(event.body || "{}");
  const { email, password } = body;

  if (!email || !password) {
    return ResponseHelper.error("Email and password are required", 400);
  }

  try {
    const authCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.USER_POOL_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const result = await cognitoClient.send(authCommand);
    
    return ResponseHelper.success({
      accessToken: result.AuthenticationResult?.AccessToken,
      refreshToken: result.AuthenticationResult?.RefreshToken,
      expiresIn: result.AuthenticationResult?.ExpiresIn,
    });
  } catch (error: any) {
    if (error.name === "NotAuthorizedException") {
      return ResponseHelper.error("Invalid email or password", 401);
    }
    return ResponseHelper.error("Login failed: " + error.message, 400);
  }
}
