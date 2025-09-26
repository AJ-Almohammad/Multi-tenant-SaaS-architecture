# Production Deployment Guide

## Overview

This guide covers deploying TaskMaster Pro to production using:
- **Frontend**: Vercel (or Netlify/AWS CloudFront)
- **Backend**: AWS Lambda + API Gateway
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito

## Backend Deployment (AWS)

### 1. Production Infrastructure Setup

```bash
# Navigate to infrastructure directory
cd infrastructure

# Set production environment variables
export NODE_ENV=production
export AWS_REGION=eu-central-1

# Deploy to production
cdk deploy --all --require-approval never

# Note down the outputs - you'll need them for frontend
```

### 2. Production Configuration

Update your CDK stack for production optimizations:

```typescript
// infrastructure/lib/taskmaster-stack.ts

// Enable DynamoDB backups
const tasksTable = new Table(this, 'TasksTable', {
  // ... existing config
  pointInTimeRecovery: true,  // Enable backups
  removalPolicy: RemovalPolicy.RETAIN,  // Don't delete in production
});

// Configure Lambda for production
const authFunction = new Function(this, 'AuthFunction', {
  // ... existing config
  reservedConcurrentExecutions: 10,  // Limit concurrency
  deadLetterQueue: dlq,  // Add dead letter queue
});
```

### 3. Environment Variables

Ensure production environment variables are set:
```bash
# In your CDK deployment, these are automatically configured:
USER_POOL_ID=eu-central-1_ProdPoolId
TASKS_TABLE_NAME=TaskMaster-Prod-Tasks
WORKSPACES_TABLE_NAME=TaskMaster-Prod-Workspaces
USERS_TABLE_NAME=TaskMaster-Prod-Users
NODE_ENV=production
```

## Frontend Deployment (Vercel)

### 1. Automatic Deployment via Git

**Step 1: Push to GitHub**
```bash
# Commit your changes
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Step 2: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Manual Deployment via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 3. Environment Variables in Vercel

Configure these environment variables in Vercel dashboard:

```env
# API Configuration
VITE_API_ENDPOINT=https://your-prod-api.execute-api.eu-central-1.amazonaws.com/prod
VITE_AWS_REGION=eu-central-1

# Cognito Configuration (from CDK output)
VITE_USER_POOL_ID=eu-central-1_YourProdPoolId
VITE_USER_POOL_CLIENT_ID=YourProdClientId

# Production Settings
VITE_APP_TITLE=TaskMaster Pro
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

## Alternative Frontend Deployments

### Option 1: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Option 2: AWS CloudFront + S3

```bash
# Add to your CDK stack
const bucket = new Bucket(this, 'FrontendBucket', {
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
  publicReadAccess: true,
});

const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
  originConfigs: [{
    s3OriginSource: { s3BucketSource: bucket },
    behaviors: [{ isDefaultBehavior: true }],
  }],
});
```

## Custom Domain Setup

### 1. Domain Configuration (Vercel)

**In Vercel Dashboard:**
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `taskmaster.yourdomain.com`)
4. Configure DNS records as instructed

**DNS Records:**
```
Type: CNAME
Name: taskmaster (or @)
Value: cname.vercel-dns.com
```

### 2. SSL Certificate

SSL certificates are automatically provided by Vercel. For custom setups:

```bash
# Let's Encrypt with Certbot
certbot certonly --webroot -w /path/to/webroot -d taskmaster.yourdomain.com
```

## Production Monitoring

### 1. AWS CloudWatch Setup

```typescript
// Add to your CDK stack
const dashboard = new Dashboard(this, 'TaskMasterDashboard', {
  dashboardName: 'TaskMaster-Production',
});

// Add API Gateway metrics
dashboard.addWidgets(
  new GraphWidget({
    title: 'API Requests',
    left: [api.metricRequestCount()],
    right: [api.metricLatency()],
  }),
);

// Set up alarms
new Alarm(this, 'HighErrorRate', {
  metric: api.metricClientError(),
  threshold: 10,
  evaluationPeriods: 2,
});
```

### 2. Application Monitoring

**Frontend (Vercel Analytics):**
- Enable Vercel Analytics in project settings
- Monitor page views, performance metrics
- Track Core Web Vitals

**Error Tracking:**
```bash
# Install Sentry for error tracking
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

## Security Considerations

### 1. AWS Security

**API Gateway:**
- Enable WAF (Web Application Firewall)
- Set up rate limiting
- Configure API keys for additional protection

```typescript
// Add to CDK stack
const webAcl = new CfnWebACL(this, 'ApiWebAcl', {
  scope: 'REGIONAL',
  defaultAction: { allow: {} },
  rules: [{
    name: 'RateLimitRule',
    priority: 1,
    action: { block: {} },
    statement: {
      rateBasedStatement: {
        limit: 2000,
        aggregateKeyType: 'IP',
      },
    },
  }],
});
```

**DynamoDB:**
- Enable encryption at rest
- Configure fine-grained access control
- Enable DynamoDB Streams for audit logging

**Cognito:**
- Configure password policies
- Enable MFA options
- Set up advanced security features

### 2. Frontend Security

**Content Security Policy:**
```typescript
// Add to Vite config
export default defineConfig({
  // ... existing config
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
    },
  },
});
```

## Performance Optimization

### 1. Frontend Performance

**Bundle Optimization:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
        },
      },
    },
  },
});
```

**Image Optimization:**
- Use WebP format for images
- Implement lazy loading
- Optimize asset delivery through CDN

### 2. Backend Performance

**DynamoDB:**
- Configure auto-scaling
- Use Global Secondary Indexes efficiently
- Implement caching strategies

**Lambda:**
- Set appropriate memory allocations
- Use provisioned concurrency for critical functions
- Implement connection pooling

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Security settings reviewed
- [ ] Performance optimizations applied
- [ ] Monitoring configured

### During Deployment
- [ ] Backend infrastructure deployed
- [ ] Frontend built and deployed
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Environment variables set

### Post-deployment
- [ ] Smoke tests completed
- [ ] Monitoring dashboards active
- [ ] Error tracking configured
- [ ] Performance metrics baseline established
- [ ] Team notified of deployment

## Rollback Strategy

### Frontend Rollback
```bash
# Vercel: Rollback to previous deployment
vercel --prod --rollback

# Or redeploy previous commit
git revert HEAD
git push origin main  # Triggers automatic redeployment
```

### Backend Rollback
```bash
# CDK: Rollback infrastructure changes
git revert HEAD
cdk deploy --all

# Manual rollback of specific functions
aws lambda update-function-code --function-name AuthFunction --zip-file fileb://previous-version.zip
```

## Maintenance

### Regular Tasks
- Monitor AWS costs and usage
- Review CloudWatch logs and metrics
- Update dependencies monthly
- Backup important data
- Review and rotate API keys

### Health Checks
Set up automated health checks:
```bash
# Simple API health check
curl -f https://your-api/health || exit 1

# Frontend health check
curl -f https://your-frontend.vercel.app || exit 1
```

## Cost Optimization

### AWS Costs
- Use DynamoDB on-demand pricing for variable workloads
- Set up billing alerts
- Review and optimize Lambda memory settings
- Use CloudWatch Logs retention policies

### Estimated Production Costs
- **DynamoDB**: $5-20/month (depending on usage)
- **Lambda**: $1-5/month (1M+ requests included)
- **API Gateway**: $1-5/month (1M+ requests included)
- **Cognito**: Free for up to 50,000 MAU
- **CloudWatch**: $1-3/month (basic monitoring)

**Total: $8-35/month** for moderate usage

## Troubleshooting

### Common Production Issues

**High API Latency:**
- Check DynamoDB metrics
- Optimize Lambda cold starts
- Review network configuration

**Authentication Failures:**
- Verify Cognito configuration
- Check JWT token expiration
- Review CORS settings

**Database Errors:**
- Monitor DynamoDB throttling
- Check IAM permissions
- Review table capacity settings
