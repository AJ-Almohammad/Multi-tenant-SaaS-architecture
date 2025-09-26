import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Set up AWS Infrastructure',
      description: 'Deploy CDK stack with all required services',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Build React Frontend',
      description: 'Create responsive UI with TypeScript',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-01-20',
    },
    {
      id: '3',
      title: 'Implement Real-time Features',
      description: 'Add WebSocket support for collaboration',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-01-25',
    },
  ];

  useEffect(() => {
    // Load mock tasks
    setTasks(mockTasks);
  }, []);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: 'New task description',
        status: 'todo',
        priority: 'medium',
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Add Task Form */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter new task title"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button
          onClick={addTask}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Task
        </button>
      </div>

      {/* Task Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Total Tasks</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>In Progress</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {tasks.filter(t => t.status === 'in_progress').length}
          </p>
        </div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Completed</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            {tasks.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Task List */}
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0 }}>Task List</h2>
        </div>

        <div style={{ padding: '0' }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    background: getStatusColor(task.status),
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ 
                    padding: '4px 12px', 
                    background: getPriorityColor(task.priority),
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {task.priority.toUpperCase()} PRIORITY
                  </span>
                  {task.dueDate && (
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => updateTaskStatus(task.id, 
                    task.status === 'completed' ? 'todo' : 'completed'
                  )}
                  style={{
                    padding: '8px 16px',
                    background: task.status === 'completed' ? '#6b7280' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {task.status === 'completed' ? 'Reopen' : 'Complete'}
                </button>
                <button
                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  In Progress
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
