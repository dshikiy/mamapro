export const getTasksFromStorage = (userId: string): any[] => {
  if (typeof window === 'undefined') return [];
  const tasks = localStorage.getItem(`tasks_${userId}`);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasksToStorage = (userId: string, tasks: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
  }
};

export const getProgressFromStorage = (userId: string) => {
  if (typeof window === 'undefined') return { completed: 0, total: 0 };
  const progress = localStorage.getItem(`progress_${userId}`);
  return progress ? JSON.parse(progress) : { completed: 0, total: 0 };
};

export const saveProgressToStorage = (userId: string, progress: { completed: number; total: number }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  }
};
