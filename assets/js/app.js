import { initAuthScreen } from './ui/screens.js';
import { loadProgress, saveProgress } from './services/progress.js';
import { getTeamById, getTeams } from './data/teams.js';
import { showMessage } from './ui/messages.js';

const appRoot = document.getElementById('app');

const boot = () => {
  const progress = loadProgress();

  if (progress?.teamId) {
    const team = getTeamById(progress.teamId);
    if (team) {
      initAuthScreen(appRoot, { team, isReturning: true, progress });
      return;
    }
  }

  initAuthScreen(appRoot, { teams: getTeams() });
};

window.addEventListener('DOMContentLoaded', boot);

window.addEventListener('beforeunload', () => {
  saveProgress(loadProgress());
});

showMessage('Sistema carregado. Informe a senha da equipe para iniciar.', 'info');
