# AWS Infrastructure Setup Guide

## Prerequisites

- AWS Account with administrative access
- AWS CLI installed and configured
- Node.js 18+ installed
- CDK CLI installed globally (`npm install -g aws-cdk`)

## Step 1: Configure AWS CLI

```bash
# Install AWS CLI (if not already installed)
# Then configure with your credentials:
aws configure

# Enter your credentials when prompted:
AWS Access Key ID: [Your Access Key]
AWS Secret Access Key: [Your Secret Key] 
Default region: eu-central-1
Default output format: json
```

## Step 2: Bootstrap CDK

```bash
# Navigate to infrastructure directory
cd infrastructure

# Bootstrap CDK for your account (one-time setup)
cdk bootstrap aws://YOUR-AWS-ACCOUNT-ID/eu-central-1
```

## Step 3: Deploy Infrastructure

```bash
# Install dependencies first
npm install

# Deploy all AWS resources
cdk deploy --all

# Wait for deployment to complete
# CDK will output your resource URLs and IDs
```

## Step 4: Configure Environment Variables

After deployment, CDK will output important values. Copy these for your frontend configuration:

```bash
# Example CDK Output:
TaskMasterStack.ApiEndpoint = https://abc123.execute-api.eu-central-1.amazonaws.com/prod
TaskMasterStack.UserPoolId = eu-central-1_AbCdEf123
TaskMasterStack.UserPoolClientId = 1a2b3c4d5e6f7g8h9i0j
```

Update your frontend environment:
```bash
# In frontend directory, create .env file:
cp .env.example .env

# Edit .env with values from CDK output:
VITE_API_ENDPOINT=https://[api-id].execute-api.eu-central-1.amazonaws.com/prod
VITE_USER_POOL_ID=eu-central-1_[userPoolId]
VITE_USER_POOL_CLIENT_ID=[clientId]
VITE_AWS_REGION=eu-central-1
```

## AWS Resources Created

### Core Infrastructure
- **DynamoDB Tables**: Users, Tasks, Workspaces
- **Lambda Functions**: Authentication, CRUD operations
- **API Gateway**: RESTful API endpoints
- **Cognito User Pool**: User authentication

### Security & Access
- **IAM Roles**: Lambda execution roles with least privilege
- **API Keys**: Rate limiting and usage tracking
- **CORS Configuration**: Frontend domain allowlisting

### Monitoring & Logging
- **CloudWatch Logs**: All Lambda function logs
- **CloudWatch Metrics**: API usage and performance
- **X-Ray Tracing**: Request tracing (optional)

## Cost Estimation

### Monthly Costs (USD)
- **DynamoDB**: $0-2 (pay-per-request, free tier covers most usage)
- **Lambda**: $0-1 (1M free requests/month)
- **API Gateway**: $0-1 (1M free requests/month)
- **Cognito**: $0 (up to 50,000 MAU free)
- **CloudWatch**: $0-1 (basic monitoring included)

**Total Estimated Monthly Cost: $3-5** (mostly within AWS Free Tier)

## Troubleshooting

### Common Issues

**CDK Bootstrap Error:**
```bash
# If bootstrap fails, ensure you have proper permissions:
aws sts get-caller-identity
```

**Deployment Timeout:**
```bash
# Increase timeout for large deployments:
cdk deploy --timeout 20
```

**Permission Denied:**
```bash
# Verify AWS credentials:
aws configure list
aws sts get-caller-identity
```

### Cleanup

To remove all AWS resources:
```bash
# WARNING: This will delete all data
cdk destroy --all
```

## Production Considerations

### Security
- Enable DynamoDB encryption at rest
- Set up WAF rules for API Gateway
- Configure VPC endpoints for private access
- Enable CloudTrail for audit logging

### Performance
- Configure DynamoDB auto-scaling
- Set up Lambda reserved concurrency
- Enable API Gateway caching
- Configure CloudFront distribution

### Monitoring
- Set up CloudWatch alarms for errors
- Configure SNS notifications
- Enable detailed monitoring
- Set up custom dashboards
