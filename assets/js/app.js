(function () {
  const STORAGE_KEY = 'investigacao-do-dia-progress';
  const appRoot = document.getElementById('app');
  const messageRoot = document.getElementById('message-root');
  const modalRoot = document.getElementById('modal-root');

  const teams = window.InvestigacaoGetTeams ? window.InvestigacaoGetTeams() : [];

  const clues = window.InvestigacaoClues || [];

  const getClueById = (id) => (window.InvestigacaoGetClueById ? window.InvestigacaoGetClueById(id) : null);
  const getTeamById = (teamId) => (window.InvestigacaoGetTeamById ? window.InvestigacaoGetTeamById(teamId) : null);
  const getTeams = () => teams;

  const formatStageLabel = (stage) => `Etapa ${stage}`;
  const normalizeCodeValue = (value) => {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
      return '';
    }

    const withoutLeadingZeros = normalized.replace(/^0+(?=\d)/, '');
    return withoutLeadingZeros || '0';
  };

  const loadProgress = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Erro ao carregar progresso.', error);
      return null;
    }
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Erro ao salvar progresso.', error);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProgress = (updates) => {
    const current = loadProgress() || {};
    const nextState = { ...current, ...updates, lastUpdated: Date.now() };
    saveProgress(nextState);
    return nextState;
  };

  const showMessage = (text, type = 'info') => {
    if (!messageRoot) {
      return;
    }

    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `<span>${text}</span>`;
    messageRoot.innerHTML = '';
    messageRoot.appendChild(message);

    window.setTimeout(() => {
      messageRoot.innerHTML = '';
    }, 3600);
  };

  const openModal = (content) => {
    if (!modalRoot) {
      return;
    }

    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card">${content}</div>
      </div>
    `;
  };

  const closeModal = () => {
    if (!modalRoot) {
      return;
    }

    modalRoot.innerHTML = '';
  };

  const authenticateByPassword = (password) => {
    const normalizedPassword = password.trim();
    const team = teams.find((entry) => entry.password === normalizedPassword);

    if (!team) {
      return null;
    }

    updateProgress({ teamId: team.id, currentStage: 1, passwordValidated: true, responseSent: false });
    return team;
  };

  const logoutTeam = () => {
    clearProgress();
  };

  const renderAuthScreen = (root, options = {}) => {
    const { teams: availableTeams = [], team, isReturning = false, progress = null } = options;
    root.innerHTML = `
      <section class="auth-screen">
        <div class="panel">
          <p class="eyebrow">Acesso da equipe</p>
          <h2 class="screen-title">Entre com a senha da equipe</h2>
          <p class="screen-copy">Use a senha entregue fisicamente para iniciar ou retomar a investigação.</p>
          <form id="auth-form" class="input-group">
            <label for="team-password">Senha da equipe</label>
            <input id="team-password" name="password" type="password" placeholder="Digite a senha" required />
            <div class="button-row">
              <button type="submit">Entrar</button>
            </div>
          </form>
          ${team ? `<div class="card" style="margin-top: 1rem;"><h3 class="screen-title">Equipe ativa</h3><p class="screen-copy">${team.name}</p></div>` : ''}
          ${isReturning && progress ? `<div class="message info" style="margin-top: 1rem;">Você retornou no ${formatStageLabel(progress.currentStage || 1)}.</div>` : ''}
        </div>
      </section>
    `;

    const form = document.getElementById('auth-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const password = document.getElementById('team-password').value;
      const authenticatedTeam = authenticateByPassword(password);

      if (!authenticatedTeam) {
        showMessage('Senha inválida. Tente novamente.', 'error');
        return;
      }

      renderMainScreen(root, authenticatedTeam, loadProgress());
    });
  };

  const renderMainScreen = (root, team, progress) => {
    const currentStage = progress?.currentStage || 1;

    if (currentStage > team.order.length) {
      renderSolutionScreen(root, team, progress);
      return;
    }

    const stageLabel = formatStageLabel(currentStage);
    const clue = getClueById(team.order[currentStage - 1]);

    if (!clue) {
      renderSolutionScreen(root, team, progress);
      return;
    }

    root.innerHTML = `
      <section class="clue-screen">
        <div class="panel">
          <div class="stage-badge">${stageLabel}</div>
          <h2 class="screen-title">${team.name}</h2>
          <p class="screen-copy">Seu próximo passo é localizar a pista física correspondente à etapa atual.</p>
          <div class="card">
            <h3 class="screen-title">Localização da pista</h3>
            <p class="screen-copy">${clue.nextLocation}</p>
          </div>
          <div class="button-row">
            <button id="found-clue">Achei a pista</button>
            <button class="secondary" id="logout">Sair</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('found-clue').addEventListener('click', () => {
      openValidationModal(team, progress);
    });

    document.getElementById('logout').addEventListener('click', () => {
      logoutTeam();
      clearProgress();
      renderAuthScreen(root, { teams: [] });
    });
  };

  const openValidationModal = (team, progress) => {
    const currentStage = progress?.currentStage || 1;
    const clue = getClueById(team.order[currentStage - 1]);

    if (!clue) {
      renderSolutionScreen(appRoot, team, progress);
      return;
    }

    openModal(`
      <div class="input-group">
        <h3 class="screen-title">Validar pista</h3>
        <p class="screen-copy">Informe a senha da equipe e o código da pista física.</p>
        <label for="validate-team">Senha da equipe</label>
        <input id="validate-team" type="password" placeholder="Digite a senha da equipe" />
        <label for="validate-code">Código da pista</label>
        <input id="validate-code" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="Digite o código" />
        <div class="button-row">
          <button id="confirm-validation">Validar</button>
          <button class="secondary" id="close-modal">Fechar</button>
        </div>
      </div>
    `);

    document.getElementById('confirm-validation').addEventListener('click', () => {
      const enteredPassword = document.getElementById('validate-team').value.trim();
      const inputCode = normalizeCodeValue(document.getElementById('validate-code').value);
      const expectedCode = normalizeCodeValue(clue.codePhysical);

      if (enteredPassword !== team.password) {
        showMessage('Informações inválidas.', 'error');
        closeModal();
        return;
      }

      if (inputCode !== expectedCode) {
        showMessage('Código inválido.', 'error');
        closeModal();
        return;
      }

      const updatedProgress = updateProgress({ currentStage: currentStage + 1, passwordValidated: true, lastUpdated: Date.now() });
      closeModal();

      const nextClue = getClueById(team.order[(updatedProgress?.currentStage || 1) - 1]);
      if (!nextClue) {
        renderSolutionScreen(appRoot, team, updatedProgress);
        return;
      }

      renderClueCardScreen(appRoot, team, updatedProgress, currentStage);
    });

    document.getElementById('close-modal').addEventListener('click', closeModal);
  };

  const renderClueCardScreen = (root, team, progress, completedStage) => {
    const clue = getClueById(team.order[completedStage - 1]);
    if (!clue) {
      renderSolutionScreen(root, team, progress);
      return;
    }

    root.innerHTML = `
      <section class="clue-screen">
        <div class="panel">
          <div class="stage-badge">Etapa ${completedStage} validada</div>
          <h2 class="screen-title">${clue.title}</h2>
          <p class="screen-copy">${clue.text}</p>
          <div class="separator"></div>
          <div class="card">
            <h3 class="screen-title">Próxima localização</h3>
            <p class="screen-copy">${clue.nextLocation}</p>
          </div>
          <div class="button-row">
            <button id="continue-game">Continuar</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('continue-game').addEventListener('click', () => {
      renderMainScreen(root, team, loadProgress());
    });
  };

  const renderSolutionScreen = (root, team, progress) => {
    const currentStage = progress?.currentStage || 1;
    const clue = getClueById(team.order[currentStage - 1]);

    if (clue) {
      renderMainScreen(root, team, progress);
      return;
    }

    root.innerHTML = `
      <section class="solution-screen">
        <div class="panel">
          <p class="eyebrow">Final</p>
          <h2 class="screen-title">A última pista foi concluída</h2>
          <p class="screen-copy">Encontre fisicamente a senha final escondida no local indicado para concluir a investigação.</p>
          <div class="card">
            <h3 class="screen-title">Localização da senha final</h3>
            <p class="screen-copy">Na gaveta da secretaria, sob a pasta azul.</p>
          </div>
          <div class="separator"></div>
          <form id="resolution-form" class="input-group">
            <label for="final-password">Senha final</label>
            <input id="final-password" type="password" placeholder="Digite a senha final" />
            <label for="resolution-text">Sua resolução</label>
            <textarea id="resolution-text" rows="6" placeholder="Descreva quem foi o assassino, como ocorreu e qual foi a motivação."></textarea>
            <div class="button-row">
              <button type="submit">Enviar resolução</button>
              <button class="secondary" type="button" id="back-home">Voltar</button>
            </div>
          </form>
        </div>
      </section>
    `;

    document.getElementById('resolution-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const finalPassword = document.getElementById('final-password').value.trim();
      const response = document.getElementById('resolution-text').value.trim();

      if (finalPassword !== team.finalPassword) {
        showMessage('Informações inválidas.', 'error');
        return;
      }

      updateProgress({ responseSent: true, finalPasswordValidated: true, resolution: response });
      showMessage('Resposta registrada com sucesso.', 'success');
    });

    document.getElementById('back-home').addEventListener('click', () => {
      renderMainScreen(root, team, loadProgress());
    });
  };

  const initAuthScreen = (root, options = {}) => {
    if (options.team && options.progress) {
      renderMainScreen(root, options.team, options.progress);
      return;
    }

    renderAuthScreen(root, options);
  };

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
})();
