export interface User {
  PK: string; // USER#userId
  SK: string; // PROFILE
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: "free" | "premium" | "enterprise";
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  PK: string; // WORKSPACE#workspaceId
  SK: string; // TASK#taskId
  taskId: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  createdBy: string;
  dueDate?: string;
  tags: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  GSI1PK: string; // USER#userId for user-centric queries
  GSI1SK: string; // TASK#taskId
}

export interface Workspace {
  PK: string; // WORKSPACE#workspaceId
  SK: string; // METADATA
  workspaceId: string;
  name: string;
  description?: string;
  owner: string; // USER#userId
  members: string[]; // Array of USER#userId
  settings: {
    isPublic: boolean;
    allowInvites: boolean;
    taskAutoAssign: boolean;
  };
  subscription: "free" | "team" | "enterprise";
  createdAt: string;
  updatedAt: string;
}

export interface APIGatewayEvent {
  httpMethod: string;
  path: string;
  pathParameters: { [key: string]: string } | null;
  queryStringParameters: { [key: string]: string } | null;
  headers: { [key: string]: string };
  body: string | null;
  requestContext: {
    authorizer?: {
      claims: {
        sub: string;
        email: string;
        "cognito:username": string;
      };
    };
    accountId: string;
    apiId: string;
    protocol: string;
    httpMethod: string;
    path: string;
    stage: string;
    requestId: string;
    requestTime: string;
    requestTimeEpoch: number;
  };
}

export interface APIResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Methods": string;
    "Access-Control-Allow-Headers": string;
  };
  body: string;
}
