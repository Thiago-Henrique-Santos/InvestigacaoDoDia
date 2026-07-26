(function () {
  const STORAGE_KEY = 'investigacao-do-dia-progress';
  const appRoot = document.getElementById('app');
  const messageRoot = document.getElementById('message-root');
  const modalRoot = document.getElementById('modal-root');

  const teams = window.InvestigacaoGetTeams ? window.InvestigacaoGetTeams() : [];

  const clues = window.InvestigacaoClues || [];
  const caseData = window.InvestigacaoGetCase ? window.InvestigacaoGetCase() : null;

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

  const openCaseModal = () => {
    const currentCase = caseData || window.InvestigacaoCase || null;
    const storyText = (currentCase?.story || 'Nenhuma informação disponível sobre o caso.').replace(/\\n/g, '<br />');

    openModal(`
      <div class="input-group case-modal-content">
        <h3 class="screen-title">${currentCase?.title || 'O caso'}</h3>
        <p class="screen-copy">${storyText}</p>
        <div class="button-row">
          <button class="secondary" id="close-modal">Fechar</button>
        </div>
      </div>
    `);

    const closeButton = document.getElementById('close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }
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
              <button class="secondary" type="button" id="open-case">Caso</button>
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

    const caseButton = document.getElementById('open-case');
    if (caseButton) {
      caseButton.addEventListener('click', () => openCaseModal());
    }
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
            <button class="secondary" id="open-case">Caso</button>
            <button class="secondary" id="logout">Sair</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('found-clue').addEventListener('click', () => {
      openValidationModal(team, progress);
    });

    document.getElementById('open-case').addEventListener('click', () => {
      openCaseModal();
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
          <div class="button-row">
            <button id="continue-game">Continuar</button>
            <button class="secondary" id="open-case">Caso</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('continue-game').addEventListener('click', () => {
      renderMainScreen(root, team, loadProgress());
    });

    document.getElementById('open-case').addEventListener('click', () => {
      openCaseModal();
    });
  };

  const renderResolutionDiscoveryScreen = (root, team, progress) => {
    root.innerHTML = `
      <section class="solution-screen">
        <div class="panel">
          <p class="eyebrow">Final</p>
          <h2 class="screen-title">Descubra a senha</h2>
          <p class="screen-copy">PARABÉNS! Vocês provaram que são ótimos investigadores! Mas um bom detetive, vai além de investigar... Ele concluí, de forma bem-sucedida, o que aconteceu no caso. Você devem passar por mais um desafio de investigação, um enigma maior, e então provar sua competência como GRANDES DETETIVES.</p>
          <div class="card">
            <h3 class="screen-title">Localização da senha final</h3>
            <p class="screen-copy">${team.finalPassClue}</p>
          </div>
          <div class="button-row">
            <button id="go-to-resolution">Continuar</button>
            <button class="secondary" type="button" id="open-case">Caso</button>
            <button class="secondary" type="button" id="back-home">Voltar</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('go-to-resolution').addEventListener('click', () => {
      updateProgress({ resolutionStep: 'form' });
      renderResolutionFormScreen(root, team, loadProgress());
    });

    document.getElementById('open-case').addEventListener('click', () => {
      openCaseModal();
    });

    document.getElementById('back-home').addEventListener('click', () => {
      renderMainScreen(root, team, loadProgress());
    });
  };

  const renderResolutionFormScreen = (root, team, progress) => {
    root.innerHTML = `
      <section class="solution-screen">
        <div class="panel">
          <p class="eyebrow">Final</p>
          <h2 class="screen-title">Inserir resolução</h2>
          <p class="screen-copy">MOMENTO DE DECISÃO! Você possui apenas 1 chance. Se acertar, todos irão ver sua vitória. Se errar, todos irão ver sua derrota. Pensem bem e escrevam a resolução do caso.</p>
          <form id="resolution-form" class="input-group">
            <label for="final-password">Senha para gerar o card de resolução da sua equipe (resposta do último enigma)</label>
            <input id="final-password" type="password" placeholder="Digite a senha final" />
            <label for="resolution-text">Sua resolução</label>
            <textarea id="resolution-text" rows="6" placeholder="Você é capaz de examinar as pistas e responder às seguintes perguntas?\n\na) descobrir a identidade de X9\nb) o motivo de X9;\nc) o segredo especial de Woodward\n\nSe for, escreva a solução do caso aqui."></textarea>
            <div class="button-row">
              <button type="submit">Enviar resolução</button>
              <button class="secondary" type="button" id="open-case">Caso</button>
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

      updateProgress({ responseSent: true, finalPasswordValidated: true, resolutionStep: 'card', resolution: response });
      showMessage('Resposta registrada com sucesso.', 'success');
      renderResolutionCardScreen(root, team, loadProgress(), response);
    });

    document.getElementById('open-case').addEventListener('click', () => {
      openCaseModal();
    });
  };

  const renderResolutionCardScreen = (root, team, progress, resolution) => {
    const caseTitle = caseData?.title || 'O caso';
    const resolutionText = resolution || progress?.resolution || 'Não informado.';

    root.innerHTML = `
      <section class="solution-screen">
        <div class="panel">
          <p class="screen-copy">Sejam rápidos! COMEMOREM em alta voz que concluíram a resolução e chamem todos para ouvir sua resposta. Mostrem o cartão resolução aos guias. Se acertarem, todos estarão olhando para os GRANDES VENCEDORES, OS GRANDES DETETIVES DESSE CASO! Mas... se errarem, todos verá sua HUMILHAÇÃO, os detetives fracassados! Não tem mais volta!</p>
          <div class="card">
            <h3 class="screen-title">${caseTitle}</h3>
            <p class="screen-copy"><strong>Equipe:</strong> ${team.name}</p>
            <p class="screen-copy"><strong>Resolução:</strong> ${resolutionText}</p>
          </div>
          <div class="button-row">
            <button id="back-home">Voltar ao início</button>
            <button class="secondary" type="button" id="open-case">Caso</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('back-home').addEventListener('click', () => {
      logoutTeam(); 
      clearProgress(); 
      // Retorna para a tela de login carregando as equipes novamente
      renderAuthScreen(root, { teams: getTeams() }); 
    });

    document.getElementById('open-case').addEventListener('click', () => {
      openCaseModal();
    });
  };

  const renderSolutionScreen = (root, team, progress) => {
    const currentStage = progress?.currentStage || 1;
    const clue = getClueById(team.order[currentStage - 1]);

    if (clue) {
      renderMainScreen(root, team, progress);
      return;
    }

    if (progress?.responseSent || progress?.finalPasswordValidated || progress?.resolutionStep === 'card') {
      renderResolutionCardScreen(root, team, progress, progress?.resolution || '');
      return;
    }

    if (progress?.resolutionStep === 'form') {
      renderResolutionFormScreen(root, team, progress);
      return;
    }

    renderResolutionDiscoveryScreen(root, team, progress);
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
