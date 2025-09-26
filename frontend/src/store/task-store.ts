import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  loadTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
}

// Mock data for development
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Set up AWS Infrastructure',
    description: 'Deploy CDK stack with all required services',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
  },
  {
    id: '2',
    title: 'Build React Frontend',
    description: 'Create responsive UI with TypeScript',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'Implement Real-time Features',
    description: 'Add WebSocket support for collaboration',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-25',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,
  currentTask: null,
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ tasks: mockTasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const newTask: Task = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set({ 
        tasks: [...get().tasks, newTask], 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    set({ isLoading: true });
    try {
      const updatedTasks = get().tasks.map(task =>
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      
      set({ tasks: updatedTasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true });
    try {
      const filteredTasks = get().tasks.filter(task => task.id !== id);
      set({ tasks: filteredTasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task });
  },
}));
