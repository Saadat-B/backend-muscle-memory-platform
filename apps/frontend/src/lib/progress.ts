import { LevelProgress, LevelStatus, UserProgress } from '@/types';
import { levels } from '@/data/levels';

const STORAGE_KEY = 'backend-muscle-memory-progress';

// Default progress state
const getDefaultProgress = (): UserProgress => {
  const levelProgress: Record<string, LevelProgress> = {};
  
  levels.forEach((level, index) => {
    levelProgress[level.id] = {
      levelId: level.id,
      status: index === 0 ? 'available' : 'locked',
      requirementsCompleted: []
    };
  });
  
  return {
    currentLevelId: levels[0].id,
    levels: levelProgress,
    totalCompleted: 0
  };
};

// Get progress from localStorage
export const getProgress = (): UserProgress => {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultProgress = getDefaultProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
};

// Save progress to localStorage
const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

// Get level status
export const getLevelStatus = (levelId: string): LevelStatus => {
  const progress = getProgress();
  return progress.levels[levelId]?.status || 'locked';
};

// Start a level (mark as in-progress)
export const startLevel = (levelId: string): UserProgress => {
  const progress = getProgress();
  
  if (progress.levels[levelId]) {
    progress.levels[levelId].status = 'in_progress';
    progress.levels[levelId].startedAt = new Date().toISOString();
    progress.currentLevelId = levelId;
    progress.lastActivity = new Date().toISOString();
  }
  
  saveProgress(progress);
  return progress;
};

// Complete a requirement
export const completeRequirement = (levelId: string, requirementId: string): UserProgress => {
  const progress = getProgress();
  
  if (progress.levels[levelId]) {
    const completed = progress.levels[levelId].requirementsCompleted;
    if (!completed.includes(requirementId)) {
      completed.push(requirementId);
    }
    progress.lastActivity = new Date().toISOString();
  }
  
  saveProgress(progress);
  return progress;
};

// Uncomplete a requirement
export const uncompleteRequirement = (levelId: string, requirementId: string): UserProgress => {
  const progress = getProgress();
  
  if (progress.levels[levelId]) {
    progress.levels[levelId].requirementsCompleted = 
      progress.levels[levelId].requirementsCompleted.filter(id => id !== requirementId);
    progress.lastActivity = new Date().toISOString();
  }
  
  saveProgress(progress);
  return progress;
};

// Complete a level
export const completeLevel = (levelId: string): UserProgress => {
  const progress = getProgress();
  
  if (progress.levels[levelId]) {
    progress.levels[levelId].status = 'completed';
    progress.levels[levelId].completedAt = new Date().toISOString();
    progress.totalCompleted++;
    progress.lastActivity = new Date().toISOString();
    
    // Unlock next level
    const currentLevel = levels.find(l => l.id === levelId);
    if (currentLevel) {
      const nextLevel = levels.find(l => l.number === currentLevel.number + 1);
      if (nextLevel && progress.levels[nextLevel.id]) {
        progress.levels[nextLevel.id].status = 'available';
        progress.currentLevelId = nextLevel.id;
      }
    }
  }
  
  saveProgress(progress);
  return progress;
};

// Unlock a specific level
export const unlockLevel = (levelId: string): UserProgress => {
  const progress = getProgress();
  
  if (progress.levels[levelId] && progress.levels[levelId].status === 'locked') {
    progress.levels[levelId].status = 'available';
  }
  
  saveProgress(progress);
  return progress;
};

// Reset all progress
export const resetProgress = (): UserProgress => {
  const defaultProgress = getDefaultProgress();
  saveProgress(defaultProgress);
  return defaultProgress;
};

// Get completion percentage
export const getCompletionPercentage = (): number => {
  const progress = getProgress();
  const totalLevels = levels.length;
  return Math.round((progress.totalCompleted / totalLevels) * 100);
};

// Get current level
export const getCurrentLevel = () => {
  const progress = getProgress();
  return levels.find(l => l.id === progress.currentLevelId);
};

// Check if level is accessible (available, in_progress, or completed)
export const isLevelAccessible = (levelId: string): boolean => {
  const status = getLevelStatus(levelId);
  return status !== 'locked';
};

// Get level requirements completion for a specific level
export const getLevelRequirementsProgress = (levelId: string): { completed: number; total: number } => {
  const progress = getProgress();
  const level = levels.find(l => l.id === levelId);
  
  if (!level || !progress.levels[levelId]) {
    return { completed: 0, total: 0 };
  }
  
  return {
    completed: progress.levels[levelId].requirementsCompleted.length,
    total: level.requirements.length
  };
};

// Check if all requirements are completed for a level
export const areAllRequirementsCompleted = (levelId: string): boolean => {
  const { completed, total } = getLevelRequirementsProgress(levelId);
  return total > 0 && completed === total;
};

// Update speed run best time
export const updateSpeedRunTime = (time: number): UserProgress => {
  const progress = getProgress();
  
  if (!progress.speedRunBestTime || time < progress.speedRunBestTime) {
    progress.speedRunBestTime = time;
  }
  
  saveProgress(progress);
  return progress;
};
