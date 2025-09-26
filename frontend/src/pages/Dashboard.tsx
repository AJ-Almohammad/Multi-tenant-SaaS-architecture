import React from 'react';
import TaskManager from '../components/TaskManager';
import { AwsStatus } from '../components/AwsStatus';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#1f2937' }}>
              TaskMaster Pro
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
              Welcome back, {user?.name}! 👋
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>

        {/* Task Manager */}
        <TaskManager />

        {/* AWS Connection Status */}
        <AwsStatus />

        {/* Deployment Instructions */}
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1f2937' }}>🚀 Next Steps</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#6b7280' }}>
            <li>Test the AWS connection above</li>
            <li>Deploy the updated Lambda functions with real business logic</li>
            <li>Configure CORS for your API Gateway</li>
            <li>Add JWT authentication to secure the endpoints</li>
            <li>Deploy frontend to AWS Amplify or S3</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
