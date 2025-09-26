# Database Schema Documentation

## Overview

TaskMaster Pro uses Amazon DynamoDB with a single-table design pattern for optimal performance and cost efficiency.

## Table Structure

### Main Table: `TaskMaster-Data`

| Attribute | Type | Description |
|-----------|------|-------------|
| PK | String | Partition Key (Primary identifier) |
| SK | String | Sort Key (Secondary identifier) |
| GSI1PK | String | Global Secondary Index Partition Key |
| GSI1SK | String | Global Secondary Index Sort Key |
| entityType | String | Type of entity (user, task, workspace) |
| createdAt | String | ISO timestamp of creation |
| updatedAt | String | ISO timestamp of last update |

## Entity Patterns

### User Entity
```json
{
  "PK": "USER#usr-123456",
  "SK": "PROFILE",
  "entityType": "user",
  "userId": "usr-123456",
  "email": "user@example.com",
  "name": "John Doe",
  "subscription": "premium",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
Task Entity
json
Copy code
{
  "PK": "WORKSPACE#ws-123456",
  "SK": "TASK#task-789012",
  "entityType": "task",
  "taskId": "task-789012",
  "workspaceId": "ws-123456",
  "title": "Complete API documentation",
  "description": "Write comprehensive API docs",
  "status": "in_progress",
  "priority": "high",
  "assignedTo": "usr-123456",
  "dueDate": "2024-01-31",
  "createdBy": "usr-123456",
  "GSI1PK": "USER#usr-123456",
  "GSI1SK": "TASK#task-789012",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
Workspace Entity
json
Copy code
{
  "PK": "WORKSPACE#ws-123456",
  "SK": "METADATA",
  "entityType": "workspace",
  "workspaceId": "ws-123456",
  "name": "Development Team",
  "description": "Software development workspace",
  "owner": "usr-123456",
  "members": ["usr-123456", "usr-789012"],
  "settings": {
    "isPublic": false,
    "allowInvites": true
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
Indexes
Primary Index: PK, SK

Global Secondary Index 1 (GSI1): GSI1PK, GSI1SK

Use Case: User-centric queries

Query Patterns
Get User Profile

javascript
Copy code
KeyCondition: PK = "USER#usr-123456" AND SK = "PROFILE"
Get Workspace Tasks

javascript
Copy code
KeyCondition: PK = "WORKSPACE#ws-123456" AND begins_with(SK, "TASK#")
Get User's Tasks (using GSI)

javascript
Copy code
KeyCondition: GSI1PK = "USER#usr-123456" AND begins_with(GSI1SK, "TASK#")
IndexName: "GSI1"
