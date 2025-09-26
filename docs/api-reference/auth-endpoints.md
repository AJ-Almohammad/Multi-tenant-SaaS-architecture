# Authentication API Reference

## Base URL
`https://your-api.execute-api.eu-central-1.amazonaws.com/prod`

## Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe", 
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User registered successfully",
    "userId": "usr-123456"
  }
}
```

### Login User
```http
POST /auth/login  
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "def50200e9a0a6a33a6a8a8a8a8a8a8a...",
    "expiresIn": 3600
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "def50200e9a0a6a33a6a8a8a8a8a8a8a..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Logout User
```http
POST /auth/logout
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": {
    "message": "Email and password are required",
    "code": "VALIDATION_ERROR"
  }
}
```

### Authentication Error
```json
{
  "success": false, 
  "error": {
    "message": "Invalid email or password",
    "code": "AUTH_ERROR"
  }
}
```

### Token Expired Error
```json
{
  "success": false,
  "error": {
    "message": "Token has expired",
    "code": "TOKEN_EXPIRED"
  }
}
```

## Authentication Headers
For protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
