
Security Model Documentation
Authentication
JSON Web Tokens (JWT)

Issuer: AWS Cognito User Pool

Algorithm: RS256 with RSA keys

Token Lifetime: 1 hour (access), 30 days (refresh)

Claims: User ID, email, groups, custom attributes

Authorization
Role-Based Access Control (RBAC)
User Roles

Workspace Owner: Full permissions

Workspace Admin: Manage tasks and members

Workspace Member: Create/manage own tasks

Workspace Viewer: Read-only access

Permission Matrix
ActionOwnerAdminMemberViewer
Create workspace✅❌❌❌
Delete workspace✅❌❌❌
Invite members✅✅❌❌
Remove members✅✅❌❌
Create tasks✅✅✅❌
Update any task✅✅❌❌
Update own tasks✅✅✅❌
Delete tasks✅✅❌❌
View tasks✅✅✅✅
API Security

API Keys: Required for all endpoints

Throttling: 1000 requests/sec per API key

Request Validation: JSON schema validation

CORS: Configured for specific origins

Lambda Function Security

IAM Roles: Least privilege

Environment Variables: Encrypted with AWS KMS

VPC Configuration: No VPC

Execution Timeout: 30s max

Data Protection

Encryption at Rest: DynamoDB AES-256, S3 SSE-S3, CloudWatch Logs encrypted

Encryption in Transit: HTTPS/TLS1.2+, CloudFront SSL/TLS termination

Security Best Practices

Password policy, monitoring, CloudTrail, GuardDuty, quarterly audits
