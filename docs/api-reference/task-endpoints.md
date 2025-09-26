# Tasks API Reference

## Authentication
All task endpoints require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Get All Tasks
```http
GET /tasks?workspaceId=ws-123456
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-123",
        "title": "Complete API documentation",
        "description": "Write comprehensive API docs",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2024-01-31",
        "createdBy": "usr-123456",
        "assignedTo": "usr-123456",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-20T15:30:00Z"
      }
    ],
    "totalCount": 1
  }
}
```

### Get Single Task
```http
GET /tasks/task-123?workspaceId=ws-123456
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-123",
      "title": "Complete API documentation",
      "description": "Write comprehensive API docs",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-31",
      "createdBy": "usr-123456",
      "assignedTo": "usr-123456",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  }
}
```

### Create New Task
```http
POST /tasks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "workspaceId": "ws-123456",
  "title": "New Task Title",
  "description": "Task description here",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2024-02-15",
  "assignedTo": "usr-789012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-456",
      "title": "New Task Title",
      "description": "Task description here",
      "status": "todo",
      "priority": "medium",
      "dueDate": "2024-02-15",
      "createdBy": "usr-123456",
      "assignedTo": "usr-789012",
      "createdAt": "2024-01-25T10:00:00Z",
      "updatedAt": "2024-01-25T10:00:00Z"
    }
  }
}
```

### Update Task
```http
PUT /tasks/task-123
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "completed",
  "priority": "high",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task-123",
      "title": "Updated Task Title",
      "description": "Updated description",
      "status": "completed",
      "priority": "high",
      "dueDate": "2024-01-31",
      "createdBy": "usr-123456",
      "assignedTo": "usr-123456",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-25T14:30:00Z"
    }
  }
}
```

### Delete Task
```http
DELETE /tasks/task-123?workspaceId=ws-123456
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

## Query Parameters

### Get All Tasks Parameters
- `workspaceId` (required): Workspace ID
- `status`: Filter by status (`todo`, `in_progress`, `completed`)
- `priority`: Filter by priority (`low`, `medium`, `high`)
- `assignedTo`: Filter by assigned user ID
- `limit`: Number of tasks to return (default: 50)
- `offset`: Number of tasks to skip (default: 0)

**Example:**
```
GET /tasks?workspaceId=ws-123&status=in_progress&priority=high&limit=10
```

## Task Status Values
- `todo`: Not started
- `in_progress`: Currently being worked on
- `completed`: Finished
- `blocked`: Cannot proceed

## Task Priority Values
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority
- `urgent`: Urgent priority

## Error Responses

### Task Not Found
```json
{
  "success": false,
  "error": {
    "message": "Task not found",
    "code": "TASK_NOT_FOUND"
  }
}
```

### Unauthorized Access
```json
{
  "success": false,
  "error": {
    "message": "You don't have permission to access this task",
    "code": "UNAUTHORIZED_ACCESS"
  }
}
```
