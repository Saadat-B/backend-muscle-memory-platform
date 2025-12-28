const SETTINGS_KEY = 'backend-muscle-memory-settings';

export interface BackendSettings {
  apiUrl: string;
  useMockMode: boolean;
  lastConnected?: string;
  connectionStatus?: 'connected' | 'disconnected' | 'unknown';
}

const DEFAULT_SETTINGS: BackendSettings = {
  apiUrl: 'http://localhost:3001',
  useMockMode: true,
  connectionStatus: 'unknown',
};

// Get settings from localStorage
export const getSettings = (): BackendSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

// Save settings to localStorage
export const saveSettings = (settings: Partial<BackendSettings>): BackendSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return getSettings();
  }
};

// Get the API URL
export const getApiUrl = (): string => {
  return getSettings().apiUrl;
};

// Check if mock mode is enabled
export const isMockMode = (): boolean => {
  return getSettings().useMockMode;
};

// Set mock mode
export const setMockMode = (enabled: boolean): void => {
  saveSettings({ useMockMode: enabled });
};

// Set API URL
export const setApiUrl = (url: string): void => {
  saveSettings({ apiUrl: url });
};

// Test connection to backend
export const testConnection = async (url?: string): Promise<{
  success: boolean;
  message: string;
  latency?: number;
}> => {
  const apiUrl = url || getSettings().apiUrl;
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      saveSettings({ 
        connectionStatus: 'connected', 
        lastConnected: new Date().toISOString() 
      });
      return {
        success: true,
        message: `Connected to ${apiUrl}`,
        latency,
      };
    } else {
      saveSettings({ connectionStatus: 'disconnected' });
      return {
        success: false,
        message: `Backend returned ${response.status}`,
        latency,
      };
    }
  } catch (error) {
    saveSettings({ connectionStatus: 'disconnected' });
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Connection timed out (5s)',
        };
      }
      return {
        success: false,
        message: error.message.includes('Failed to fetch') 
          ? 'Cannot reach backend - is it running?' 
          : error.message,
      };
    }
    
    return {
      success: false,
      message: 'Connection failed',
    };
  }
};

// Reset settings to defaults
export const resetSettings = (): BackendSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
};
