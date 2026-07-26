const STORAGE_KEY = 'investigacao-do-dia-progress';

export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Erro ao carregar progresso.', error);
    return null;
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Erro ao salvar progresso.', error);
  }
};

export const clearProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const updateProgress = (updates) => {
  const current = loadProgress() || {};
  const nextState = { ...current, ...updates, lastUpdated: Date.now() };
  saveProgress(nextState);
  return nextState;
};
