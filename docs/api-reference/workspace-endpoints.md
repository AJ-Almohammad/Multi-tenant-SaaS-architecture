# Workspaces API Reference

## Overview
Workspaces allow team collaboration and task organization. Each workspace can have multiple members with different roles.

## Authentication
All workspace endpoints require JWT token:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Get User Workspaces
```http
GET /workspaces
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workspaces": [
      {
        "id": "ws-123456",
        "name": "Development Team",
        "description": "Software development workspace",
        "owner": "usr-123456",
        "memberCount": 5,
        "taskCount": 23,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-20T10:30:00Z",
        "role": "owner"
      }
    ],
    "totalCount": 1
  }
}
```

### Get Single Workspace
```http
GET /workspaces/ws-123456
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "ws-123456",
      "name": "Development Team",
      "description": "Software development workspace",
      "owner": "usr-123456",
      "members": [
        {
          "userId": "usr-123456",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "owner",
          "joinedAt": "2024-01-01T00:00:00Z"
        },
        {
          "userId": "usr-789012",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "role": "admin",
          "joinedAt": "2024-01-05T10:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

### Create Workspace
```http
POST /workspaces
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Marketing Team",
  "description": "Marketing campaign workspace"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "ws-789012",
      "name": "Marketing Team",
      "description": "Marketing campaign workspace",
      "owner": "usr-123456",
      "members": [
        {
          "userId": "usr-123456",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "owner",
          "joinedAt": "2024-01-25T15:00:00Z"
        }
      ],
      "createdAt": "2024-01-25T15:00:00Z",
      "updatedAt": "2024-01-25T15:00:00Z"
    }
  }
}
```

### Update Workspace
```http
PUT /workspaces/ws-123456
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Workspace Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workspace": {
      "id": "ws-123456",
      "name": "Updated Workspace Name",
      "description": "Updated description",
      "owner": "usr-123456",
      "memberCount": 5,
      "taskCount": 23,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-25T16:00:00Z"
    }
  }
}
```

### Delete Workspace
```http
DELETE /workspaces/ws-123456
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Workspace deleted successfully"
  }
}
```

### Invite Member to Workspace
```http
POST /workspaces/ws-123456/invite
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "teammate@example.com",
  "role": "member"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Invitation sent successfully",
    "invitationId": "inv-123456"
  }
}
```

### Update Member Role
```http
PUT /workspaces/ws-123456/members/usr-789012
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Member role updated successfully",
    "member": {
      "userId": "usr-789012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "admin",
      "joinedAt": "2024-01-05T10:00:00Z"
    }
  }
}
```

### Remove Member from Workspace
```http
DELETE /workspaces/ws-123456/members/usr-789012
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Member removed successfully"
  }
}
```

### Leave Workspace
```http
POST /workspaces/ws-123456/leave
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "You have left the workspace successfully"
  }
}
```

## Workspace Roles

### Owner
- Full permissions
- Can delete workspace
- Can manage all members
- Can update workspace settings
- Cannot be removed by others

### Admin
- Manage members (invite, remove, change roles except owner)
- Update workspace settings
- Create and manage all tasks
- Cannot delete workspace

### Member
- Create and manage own tasks
- View all workspace tasks
- Comment on tasks
- Cannot manage other members

### Viewer
- Read-only access to workspace
- View tasks and comments
- Cannot create or modify tasks
- Cannot manage members

## Query Parameters

### Get User Workspaces Parameters
- `role`: Filter by user role (`owner`, `admin`, `member`, `viewer`)
- `limit`: Number of workspaces to return (default: 50)
- `offset`: Number of workspaces to skip (default: 0)

## Error Responses

### Workspace Not Found
```json
{
  "success": false,
  "error": {
    "message": "Workspace not found",
    "code": "WORKSPACE_NOT_FOUND"
  }
}
```

### Insufficient Permissions
```json
{
  "success": false,
  "error": {
    "message": "You don't have permission to perform this action",
    "code": "INSUFFICIENT_PERMISSIONS"
  }
}
```

### Member Already Exists
```json
{
  "success": false,
  "error": {
    "message": "User is already a member of this workspace",
    "code": "MEMBER_ALREADY_EXISTS"
  }
}
```

### Cannot Leave Workspace
```json
{
  "success": false,
  "error": {
    "message": "Owner cannot leave workspace. Transfer ownership first.",
    "code": "OWNER_CANNOT_LEAVE"
  }
}
```
