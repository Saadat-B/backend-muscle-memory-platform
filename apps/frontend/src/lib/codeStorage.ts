import { UserProgress } from '@/types';

const CODE_STORAGE_KEY = 'backend-muscle-memory-code';

interface CodeStorage {
  [levelId: string]: {
    code: string;
    lastUpdated: string;
  };
}

// Get all saved code
export const getSavedCode = (): CodeStorage => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(CODE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save code for a level
export const saveCode = (levelId: string, code: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const storage = getSavedCode();
    storage[levelId] = {
      code,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save code:', error);
  }
};

// Get code for a specific level
export const getCodeForLevel = (levelId: string): string | null => {
  const storage = getSavedCode();
  return storage[levelId]?.code || null;
};

// Clear code for a level
export const clearCodeForLevel = (levelId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const storage = getSavedCode();
    delete storage[levelId];
    localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to clear code:', error);
  }
};

// Clear all code
export const clearAllCode = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CODE_STORAGE_KEY);
};
