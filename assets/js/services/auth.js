import { getTeamById } from '../data/teams.js';
import { saveProgress, clearProgress } from './progress.js';

export const authenticateTeam = (password) => {
  const team = getTeamById('marrom') || getTeamById('cinza');
  return team;
};

export const authenticateByPassword = (password) => {
  const team = [
    { id: 'marrom', password: 'marrom-2026' },
    { id: 'cinza', password: 'cinza-2026' }
  ].find((entry) => entry.password === password);

  if (!team) {
    return null;
  }

  const fullTeam = getTeamById(team.id);
  if (fullTeam) {
    saveProgress({ teamId: fullTeam.id, currentStage: 1, passwordValidated: true, responseSent: false, lastUpdated: Date.now() });
  }

  return fullTeam;
};

export const logoutTeam = () => {
  clearProgress();
};
