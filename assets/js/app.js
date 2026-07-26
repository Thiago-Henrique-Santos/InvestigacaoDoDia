(function () {
  const STORAGE_KEY = 'investigacao-do-dia-progress';
  const appRoot = document.getElementById('app');
  const messageRoot = document.getElementById('message-root');
  const modalRoot = document.getElementById('modal-root');

  const teams = window.InvestigacaoGetTeams ? window.InvestigacaoGetTeams() : [];

  const clues = [
    {
      id: 1,
      title: 'A primeira gravação',
      text: 'A voz do arquivo revela que o observador estava no local antes da chegada da vítima. O primeiro detalhe é um objeto que não deveria estar ali.',
      nextLocation: 'No balcão principal, ao lado do relógio antigo.',
      codePhysical: 101
    },
    {
      id: 2,
      title: 'A cadeira de madeira',
      text: 'A cadeira estava inclinada, como se alguém tivesse deixado a cena em pressa. O que faltava ali era a peça de identificação.',
      nextLocation: 'Na estante de livros, na prateleira mais baixa.',
      codePhysical: 202
    },
    {
      id: 3,
      title: 'O envelope rasgado',
      text: 'O envelope possui marcas de dedos e uma inscrição quase apagada. A resposta está no que foi retirado do interior.',
      nextLocation: 'Atrás da porta de vidro, próximo ao vaso.',
      codePhysical: 303
    },
    {
      id: 4,
      title: 'A chave do armário',
      text: 'A chave revela um compartimento onde o suspeito guardava o próprio segredo. O que foi deixado em silêncio é o ponto de partida.',
      nextLocation: 'No corredor lateral, sob a bancada de metal.',
      codePhysical: 404
    },
    {
      id: 5,
      title: 'A fotografia embaçada',
      text: 'A imagem mostra uma mão que nunca deveria ter aparecido. O detalhe é pequeno, porém decisivo.',
      nextLocation: 'Na entrada, entre as duas plantas.',
      codePhysical: 505
    },
    {
      id: 6,
      title: 'A garrafa de vidro',
      text: 'A garrafa traz um rastro de poeira e um pó que não pertence ao local. Quem esteve ali já deixou a marca.',
      nextLocation: 'Na área de descanso, embaixo da cadeira vermelha.',
      codePhysical: 606
    },
    {
      id: 7,
      title: 'O mapa improvisado',
      text: 'O mapa aponta para um lugar que não consta no plano oficial. A verdade sobe quando o roteiro é invertido.',
      nextLocation: 'No pátio, perto da lixeira metálica.',
      codePhysical: 707
    },
    {
      id: 8,
      title: 'A fita adesiva',
      text: 'A fita está enrolada em torno de um objeto comum. O que ela esconde é um nome, não um objeto.',
      nextLocation: 'Na escada de serviço, no segundo degrau.',
      codePhysical: 808
    },
    {
      id: 9,
      title: 'O relógio parado',
      text: 'O relógio marcou uma hora que não combina com o relato. Esse atraso transforma o suspeito em testemunha.',
      nextLocation: 'Na sala de arquivos, na lateral direita.',
      codePhysical: 909
    },
    {
      id: 10,
      title: 'A caneta sem tinta',
      text: 'A caneta foi usada para escrever um nome que nunca saiu da memória. O detalhe está na letra torta.',
      nextLocation: 'Ao lado do quadro branco, na parte inferior.',
      codePhysical: 1001
    },
    {
      id: 11,
      title: 'O recibo antigo',
      text: 'O recibo mostra uma compra feita na hora errada. O valor não interessa; o horário é a pista.',
      nextLocation: 'No canto esquerdo da recepção.',
      codePhysical: 1102
    },
    {
      id: 12,
      title: 'A luva esquecida',
      text: 'A luva carrega um fio de tecido que não pertence ao local. Ele aponta para quem veio e saiu.',
      nextLocation: 'Na janela do fundo, sobre o parapeito.',
      codePhysical: 1203
    },
    {
      id: 13,
      title: 'A lista de contatos',
      text: 'A lista revela um vínculo entre duas pessoas que nunca foram associadas oficialmente. A ligação é emocional, não profissional.',
      nextLocation: 'No depósito, junto à caixa de ferramentas.',
      codePhysical: 1304
    },
    {
      id: 14,
      title: 'A chave de fenda',
      text: 'A chave de fenda serve para abrir algo simples, mas a intenção era outra. O crime precisou de um gesto preciso.',
      nextLocation: 'Ao lado da máquina de café, na prateleira.',
      codePhysical: 1405
    },
    {
      id: 15,
      title: 'O relatório apagado',
      text: 'O relatório foi reescrito para ser inocente. O erro aparece na ordem das palavras, não nas palavras em si.',
      nextLocation: 'Na mesa do coordenador, junto ao bloco amarelo.',
      codePhysical: 1506
    },
    {
      id: 16,
      title: 'A poeira na janela',
      text: 'A poeira mostra que alguém abriu a janela em momento inesperado. A cena começou de fora para dentro.',
      nextLocation: 'No jardim interno, perto do banco de ferro.',
      codePhysical: 1607
    },
    {
      id: 17,
      title: 'A última carta',
      text: 'A carta não foi enviada. Ela foi segurada no momento certo, quando a verdade já estava a um passo de ser revelada.',
      nextLocation: 'Na entrada do prédio, sob o tapete.',
      codePhysical: 1708
    },
    {
      id: 18,
      title: 'O caso encerrado',
      text: 'A última pista aponta para o local onde a senha final foi escondida. Ela não pode ser encontrada antes do tempo.',
      nextLocation: 'Na gaveta da secretaria, sob a pasta azul.',
      codePhysical: 1809
    }
  ];

  const getClueById = (id) => clues.find((clue) => clue.id === id);
  const getTeamById = (teamId) => (window.InvestigacaoGetTeamById ? window.InvestigacaoGetTeamById(teamId) : null);
  const getTeams = () => teams;

  const formatStageLabel = (stage) => `Etapa ${stage}`;

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
        <input id="validate-code" type="number" placeholder="Digite o código" />
        <div class="button-row">
          <button id="confirm-validation">Validar</button>
          <button class="secondary" id="close-modal">Fechar</button>
        </div>
      </div>
    `);

    document.getElementById('confirm-validation').addEventListener('click', () => {
      const enteredPassword = document.getElementById('validate-team').value.trim();
      const inputCode = Number(document.getElementById('validate-code').value);

      if (enteredPassword !== team.password) {
        showMessage('Informações inválidas.', 'error');
        closeModal();
        return;
      }

      if (inputCode !== clue.codePhysical) {
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
