import { APIGatewayEvent } from "../../shared/types";
import { ResponseHelper } from "../../shared/utils/response-helper";
import { DynamoDBHelper } from "../../shared/utils/dynamodb-helper";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const user = event.requestContext.authorizer?.claims;
    if (!user) {
      return ResponseHelper.unauthorized();
    }

    const userId = user.sub;
    const { httpMethod, path, pathParameters } = event;
    const taskId = pathParameters?.taskId;

    console.log("Tasks function called:", httpMethod, path, "by user:", userId);

    switch (true) {
  case httpMethod === "GET" && path === "/tasks":
    return await getTasks(event, userId);
  case httpMethod === "POST" && path === "/tasks":
    return await createTask(event, userId);
  case httpMethod === "GET" && !!taskId:
    return await getTask(event, userId, taskId!);
  case httpMethod === "PUT" && !!taskId:
    return await updateTask(event, userId, taskId!);
  case httpMethod === "DELETE" && !!taskId:
    return await deleteTask(event, userId, taskId!);
  default:
    return ResponseHelper.error("Endpoint not found", 404);
}

  } catch (error) {
    console.error("Tasks function error:", error);
    return ResponseHelper.error("Failed to process task operation", 500);
  }
};

async function getTasks(event: APIGatewayEvent, userId: string) {
  const workspaceId = event.queryStringParameters?.workspaceId;
  
  if (!workspaceId) {
    return ResponseHelper.error("Workspace ID is required", 400);
  }

  // Verify user has access to workspace
  const workspace = await DynamoDBHelper.getItem(process.env.WORKSPACES_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: "METADATA"
  });

  if (!workspace || !workspace.members.includes(`USER#${userId}`)) {
    return ResponseHelper.unauthorized("No access to this workspace");
  }

  const tasks = await DynamoDBHelper.query(
    process.env.TASKS_TABLE!,
    "PK = :pk AND begins_with(SK, :sk)",
    {
      ":pk": `WORKSPACE#${workspaceId}`,
      ":sk": "TASK#"
    }
  );

  return ResponseHelper.success({ tasks });
}

async function createTask(event: APIGatewayEvent, userId: string) {
  const body = JSON.parse(event.body || "{}");
  const { workspaceId, title, description, status, priority, assignedTo, dueDate } = body;

  if (!workspaceId || !title) {
    return ResponseHelper.error("Workspace ID and title are required", 400);
  }

  // Verify user has access to workspace
  const workspace = await DynamoDBHelper.getItem(process.env.WORKSPACES_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: "METADATA"
  });

  if (!workspace || !workspace.members.includes(`USER#${userId}`)) {
    return ResponseHelper.unauthorized("No access to this workspace");
  }

  const taskId = uuidv4();
  const task = {
    PK: `WORKSPACE#${workspaceId}`,
    SK: `TASK#${taskId}`,
    taskId,
    workspaceId,
    title,
    description: description || "",
    status: status || "todo",
    priority: priority || "medium",
    assignedTo: assignedTo || null,
    createdBy: userId,
    dueDate: dueDate || null,
    tags: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    GSI1PK: `USER#${assignedTo || userId}`,
    GSI1SK: `TASK#${taskId}`
  };

  await DynamoDBHelper.putItem(process.env.TASKS_TABLE!, task);

  return ResponseHelper.success({ task }, 201);
}

async function getTask(event: APIGatewayEvent, userId: string, taskId: string) {
  const workspaceId = event.queryStringParameters?.workspaceId;
  
  if (!workspaceId) {
    return ResponseHelper.error("Workspace ID is required", 400);
  }

  const task = await DynamoDBHelper.getItem(process.env.TASKS_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: `TASK#${taskId}`
  });

  if (!task) {
    return ResponseHelper.notFound("Task not found");
  }

  const workspace = await DynamoDBHelper.getItem(process.env.WORKSPACES_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: "METADATA"
  });

  if (!workspace || !workspace.members.includes(`USER#${userId}`)) {
    return ResponseHelper.unauthorized("No access to this task");
  }

  return ResponseHelper.success({ task });
}

async function updateTask(event: APIGatewayEvent, userId: string, taskId: string) {
  const body = JSON.parse(event.body || "{}");
  const workspaceId = body.workspaceId || event.queryStringParameters?.workspaceId;
  
  if (!workspaceId) {
    return ResponseHelper.error("Workspace ID is required", 400);
  }

  const existingTask = await DynamoDBHelper.getItem(process.env.TASKS_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: `TASK#${taskId}`
  });

  if (!existingTask) {
    return ResponseHelper.notFound("Task not found");
  }

  const workspace = await DynamoDBHelper.getItem(process.env.WORKSPACES_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: "METADATA"
  });

  if (!workspace || !workspace.members.includes(`USER#${userId}`)) {
    return ResponseHelper.unauthorized("No access to this task");
  }

  const allowedUpdates = ["title", "description", "status", "priority", "assignedTo", "dueDate"];
  const updates: any = {};

  Object.keys(body).forEach(key => {
    if (allowedUpdates.includes(key) && body[key] !== undefined) {
      updates[key] = body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return ResponseHelper.error("No valid fields to update", 400);
  }

  updates.updatedAt = new Date().toISOString();

  const updateExpression = `SET ${Object.keys(updates).map(k => `#${k} = :${k}`).join(", ")}`;
  const expressionValues: any = {};
  Object.keys(updates).forEach(key => {
    expressionValues[`:${key}`] = updates[key];
  });

  const updatedTask = await DynamoDBHelper.updateItem(
    process.env.TASKS_TABLE!,
    { PK: `WORKSPACE#${workspaceId}`, SK: `TASK#${taskId}` },
    updateExpression,
    expressionValues
  );

  return ResponseHelper.success({ task: updatedTask });
}

async function deleteTask(event: APIGatewayEvent, userId: string, taskId: string) {
  const workspaceId = event.queryStringParameters?.workspaceId;
  
  if (!workspaceId) {
    return ResponseHelper.error("Workspace ID is required", 400);
  }

  const existingTask = await DynamoDBHelper.getItem(process.env.TASKS_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: `TASK#${taskId}`
  });

  if (!existingTask) {
    return ResponseHelper.notFound("Task not found");
  }

  const workspace = await DynamoDBHelper.getItem(process.env.WORKSPACES_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: "METADATA"
  });

  if (!workspace || !workspace.members.includes(`USER#${userId}`)) {
    return ResponseHelper.unauthorized("No access to this task");
  }

  await DynamoDBHelper.deleteItem(process.env.TASKS_TABLE!, {
    PK: `WORKSPACE#${workspaceId}`,
    SK: `TASK#${taskId}`
  });

  return ResponseHelper.success({ message: "Task deleted successfully" });
}
