class RealApiService {
  private baseUrl = import.meta.env.VITE_API_URL || '';

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Connection test failed:', error.message);
        return { success: false, error: error.message };
      }
      return { success: false, error: String(error) };
    }
  }

  async register(email: string, name: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Registration failed:', error.message);
        throw error;
      }
      throw new Error(String(error));
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
        throw error;
      }
      throw new Error(String(error));
    }
  }

  async getTasks(workspaceId: string = 'default') {
    try {
      const response = await fetch(`${this.baseUrl}/tasks?workspaceId=${workspaceId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to fetch tasks:', error.message);
        throw error;
      }
      throw new Error(String(error));
    }
  }

  async testProxy() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Proxy test failed:', error.message);
        throw error;
      }
      throw new Error(String(error));
    }
  }
}

export const realApiService = new RealApiService();
