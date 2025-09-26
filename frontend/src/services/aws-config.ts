// src/services/aws-config.ts

const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true" || 
                   import.meta.env.VITE_API_ENDPOINT?.includes("demo-mode");

const awsConfig = isDemoMode ? {
  // Demo mode configuration
  Auth: {
    region: "eu-central-1",
    userPoolId: "demo-pool",
    userPoolWebClientId: "demo-client",
  },
  API: {
    endpoints: [
      {
        name: "TaskMasterAPI",
        endpoint: "https://demo-mode.local",
        region: "eu-central-1",
      },
    ],
  },
} : {
  // Real AWS configuration
  Auth: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
  API: {
    endpoints: [
      {
        name: "TaskMasterAPI",
        endpoint: import.meta.env.VITE_API_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION,
      },
    ],
  },
};

console.log(isDemoMode ? "🚀 Running in DEMO mode" : "🔗 Connecting to real AWS");

export { awsConfig, isDemoMode };
