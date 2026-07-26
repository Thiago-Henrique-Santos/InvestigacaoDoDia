(function () {
  const teams = [
    {
      id: 'marrom',
      name: 'Equipe Marrom',
      password: 'âmbar',
      order: [8, 4, 16, 2, 12, 6, 14, 1, 9, 11, 3, 15, 7, 10, 13, 5, 17, 18],
      finalPassClue: 'Sou a última etapa de um processo indispensável à vida. Sem mim, haveria um problema. Comigo, ninguém quer permanecer por perto. Meu nome tem cinco letras.',
      finalPassword: 'bosta'
    },
    {
      id: 'cinza',
      name: 'Equipe Cinza',
      password: 'narval',
      order: [3, 10, 1, 17, 5, 13, 9, 18, 7, 14, 2, 16, 8, 12, 6, 15, 4, 11],
      finalPassClue: 'Nasço invisível. Quase nunca sou bem-vindo. Às vezes anuncio minha chegada sem pedir licença, outras vezes passo despercebido. Ainda assim, quando sou ouvido, dificilmente sou esquecido. Uma única sílaba basta para me definir.',
      finalPassword: 'pum'
    }
  ];

  window.InvestigacaoTeams = teams;
  window.InvestigacaoGetTeams = function getTeams() {
    return teams;
  };
  window.InvestigacaoGetTeamById = function getTeamById(teamId) {
    return teams.find((team) => team.id === teamId);
  };
})();
