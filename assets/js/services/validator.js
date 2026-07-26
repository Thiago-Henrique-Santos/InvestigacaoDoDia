import { getClueById, getClueByPhysicalCode } from '../data/clues.js';
import { getTeamById } from '../data/teams.js';
import { loadProgress, saveProgress } from './progress.js';

export const validateEntry = ({ teamId, code, stage }) => {
  const team = getTeamById(teamId);
  const progress = loadProgress();

  if (!team || !progress) {
    return { valid: false, message: 'Você ainda não chegou nesta etapa.' };
  }

  const expectedStage = progress.currentStage || 1;

  if (expectedStage !== stage) {
    return { valid: false, message: 'Você ainda não chegou nesta etapa.' };
  }

  const expectedCode = team.order[expectedStage - 1];
  const clue = getClueById(expectedCode);

  if (!clue) {
    return { valid: false, message: 'Código inválido.' };
  }

  if (code !== clue.codePhysical) {
    return { valid: false, message: 'Código inválido.' };
  }

  const nextStage = expectedStage + 1;
  saveProgress({ ...progress, currentStage: nextStage, passwordValidated: true, lastUpdated: Date.now() });

  return { valid: true, nextStage, message: 'Pista validada com sucesso.' };
};

export const validateFinalPassword = ({ teamId, password }) => {
  const team = getTeamById(teamId);
  const progress = loadProgress();

  if (!team || !progress) {
    return { valid: false, message: 'Informações inválidas.' };
  }

  if (progress.currentStage <= team.order.length) {
    return { valid: false, message: 'Você ainda não chegou nesta etapa.' };
  }

  if (password !== team.finalPassword) {
    return { valid: false, message: 'Informações inválidas.' };
  }

  saveProgress({ ...progress, finalPasswordValidated: true, lastUpdated: Date.now() });
  return { valid: true, message: 'Senha final validada.' };
};
