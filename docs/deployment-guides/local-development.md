# Local Development Guide

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/taskmaster-pro.git
cd taskmaster-pro

# 2. Install root dependencies
npm install

# 3. Set up frontend
cd frontend
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings (see configuration section below)

# 5. Start development server
npm run dev
```

## Project Structure

```
taskmaster-pro/
├── frontend/             # React TypeScript application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service layer
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json
├── backend/              # Lambda functions
│   ├── src/
│   │   ├── auth/         # Authentication functions
│   │   ├── tasks/        # Task management functions
│   │   ├── workspaces/   # Workspace functions
│   │   └── shared/       # Shared utilities
│   └── package.json
├── infrastructure/       # AWS CDK code
│   ├── lib/              # CDK stack definitions
│   ├── bin/              # CDK app entry point
│   └── package.json
└── docs/                # Documentation
```

## Development Commands

### Frontend Development
```bash
cd frontend

# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run coverage     # Generate test coverage
```

### Backend Development
```bash
cd backend

# Development
npm run build        # Build Lambda functions
npm run watch        # Build and watch for changes
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

### Infrastructure Development
```bash
cd infrastructure

# CDK Commands
cdk synth           # Generate CloudFormation template
cdk deploy          # Deploy to AWS
cdk deploy --hotswap # Fast deployment for development
cdk diff            # Show differences
cdk destroy         # Remove all resources

# Development
npm run build       # Compile TypeScript
npm run watch       # Watch for changes
npm run test        # Run unit tests
```

## Environment Configuration

### Frontend (.env)
Create `frontend/.env` file:
```env
# API Configuration
VITE_API_ENDPOINT=https://your-api.execute-api.eu-central-1.amazonaws.com/prod
VITE_AWS_REGION=eu-central-1

# Cognito Configuration
VITE_USER_POOL_ID=eu-central-1_yourUserPoolId
VITE_USER_POOL_CLIENT_ID=yourClientId

# Development Settings
VITE_APP_TITLE=TaskMaster Pro
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### Backend Environment Variables
Backend functions automatically receive environment variables from CDK deployment:
- `USER_POOL_ID`: Cognito User Pool ID
- `TASKS_TABLE_NAME`: DynamoDB Tasks table name
- `WORKSPACES_TABLE_NAME`: DynamoDB Workspaces table name
- `USERS_TABLE_NAME`: DynamoDB Users table name

## Local Testing

### Frontend Testing
```bash
cd frontend

# Run all tests
npm run test

# Run specific test file
npm run test src/components/TaskCard.test.tsx

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

### Backend Testing
```bash
cd backend

# Run all tests
npm run test

# Run specific test suite
npm run test -- --testNamePattern="auth"

# Run tests with coverage
npm run test -- --coverage
```

## Development Workflow

### 1. Start Development Environment
```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Watch backend changes
cd backend
npm run watch

# Terminal 3: Watch infrastructure changes (optional)
cd infrastructure  
npm run watch
```

### 2. Making Changes

**Frontend Changes:**
- Edit React components in `frontend/src/`
- Hot reload automatically updates browser
- Check console for TypeScript errors

**Backend Changes:**
- Edit Lambda functions in `backend/src/`
- Run `npm run build` to compile
- Deploy with `cdk deploy --hotswap` for faster updates

**Infrastructure Changes:**
- Edit CDK stacks in `infrastructure/lib/`
- Run `cdk diff` to see changes
- Deploy with `cdk deploy`

### 3. Testing Your Changes
```bash
# Frontend: Open http://localhost:5173
# Try registering a new user
# Create test workspaces and tasks
# Verify all features work correctly

# Backend: Test API endpoints
curl -X POST https://your-api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

## Debugging

### Frontend Debugging
- Use React Developer Tools browser extension
- Check browser console for errors and warnings
- Use `console.log()` or debugger statements
- Inspect network requests in browser DevTools

### Backend Debugging
- Check CloudWatch Logs for Lambda function output
- Use `console.log()` statements in Lambda functions
- Test functions locally with AWS SAM (optional)
- Use X-Ray tracing for performance analysis

### Common Issues

**Frontend not connecting to API:**
- Verify `VITE_API_ENDPOINT` in `.env` file
- Check CORS configuration in API Gateway
- Ensure API is deployed and accessible

**Authentication errors:**
- Verify Cognito configuration in `.env`
- Check user pool and client settings
- Ensure proper JWT token handling

**DynamoDB errors:**
- Check table names in environment variables
- Verify IAM permissions for Lambda functions
- Ensure tables exist and are properly configured

## Development Best Practices

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Use feature branches for development

### Testing
- Write unit tests for new components and functions
- Maintain good test coverage (>80%)
- Test both happy paths and error scenarios
- Use meaningful test descriptions

### Performance
- Optimize bundle size with code splitting
- Use React.memo for expensive components
- Implement proper error boundaries
- Monitor API response times

## Hot Reload Issues

If hot reload stops working:
```bash
# Clear Vite cache
rm -rf frontend/node_modules/.vite

# Restart development server
cd frontend
npm run dev
```

## Database Seeding (Optional)

For local development, you might want to seed your database:
```bash
# Create seed script
cd backend
node scripts/seedDatabase.js
```
