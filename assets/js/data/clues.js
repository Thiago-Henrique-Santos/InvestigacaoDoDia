(function () {
  const cluesData = [
  {
    id: 1,
    title: 'Garagem abandonada',
    text: 'PISTA DA IDENTIDADE (5 partes) | I. X9 pode ter várias facetas.',
    nextLocation: 'Não tenho pernas, mas recebo quem percorre longos caminhos. Quando alguém chega cansado, é aqui que o descanso se inicia.',
    codePhysical: '070'
  },
  {
    id: 2,
    title: 'Sofá revirado',
    text: 'PISTA DO MOTIVO (6 partes) | I. Fórmula da água.',
    nextLocation: 'Quanto mais pessoas me procuram, menos espaço eu tenho. Ainda assim, ninguém reclama quando afunda em mim.',
    codePhysical: '050'
  },
  {
    id: 3,
    title: 'Fogão enferrujado',
    text: 'Quando X9 queria se encontrar com Woodward, ele circulava a página 20 do jornal matinal de Woodward e usava ponteiros do relógio no final da página para indicar o horário do encontro.',
    nextLocation: 'O que entra nem sempre sai igual. O tempo ajuda, mas sozinha nunca basta. Descubra onde a mudança acontece mesmo que nem todos percebam.',
    codePhysical: '141'
  },
  {
    id: 4,
    title: 'Televisão antiga',
    text: 'PISTA DA IDENTIDADE (5 partes) | II. X9 também sabia tocar violino.',
    nextLocation: 'Conto histórias todos os dias, mas nunca escrevi nenhuma. Milhares de olhos me observam enquanto eu permaneço em silêncio.',
    codePhysical: '284'
  },
  {
    id: 5,
    title: 'Mesa empoeirada',
    text: 'PISTA DO MOTIVO (6 partes) | II. Norte - Símbolo',
    nextLocation: 'Há um canto da casa onde a concentração disputa espaço com a distração. Quem se senta ali pode terminar um projeto... ou começar uma aventura. Encontre o ponto de encontro desses dois mundos.',
    codePhysical: '014'
  },
  {
    id: 6,
    title: 'Notebook trincado',
    text: 'Outros membros da equipe da Casa Branca eram Kenneth Clawson, Dwight Chapin, Jeb Magruder e Egil "Bud" Krogh.',
    nextLocation: 'Posso guardar mais lembranças que uma pessoa. Mas, sem energia, esqueço até como falar.',
    codePhysical: '087'
  },
  {
    id: 7,
    title: 'Tanque de guerra em destroços',
    text: 'PISTA DA IDENTIDADE (5 partes) | III. X9 Costumava trabalhar na Inglaterra, para a Scotland Yard.',
    nextLocation: 'Há um lugar onde as marcas do dia costumam desaparecer. Nem tudo o que entra volta igual. Procure onde o passado é lavado embora aos poucos.',
    codePhysical: '342'
  },
  {
    id: 8,
    title: 'Caixa de substâncias tóxicas',
    text: 'Reuniões entre Woodward e X9 foram realizadas durante a noite em uma garagem subterrânea.',
    nextLocation: 'Nem tudo o que existe aqui deve ser usado. A escolha do que usar se deve ao que está sentindo.',
    codePhysical: '029'
  },
  {
    id: 9,
    title: 'Cama coberta de teias de aranha',
    text: 'PISTA DA IDENTIDADE (5 partes) | IV. X9, na realidade, era mais de uma pessoa.',
    nextLocation: 'Quanto menos você percebe minha presença, mais tempo costuma passar comigo. Estou disponível 24 horas por dia, mas costumo ser usada em nem metade desse tempo.',
    codePhysical: '161'
  },
  {
    id: 10,
    title: 'Quadrinhos esquecido',
    text: 'Quando Woodward queria se encontrar com X9, o repórter movia um vaso de flor de uma ponta de sua sacada para a outra.',
    nextLocation: 'Minhas histórias falam mais por imagens do que por palavras. Mesmo parado na estante, posso salvar o mundo centenas de vezes.',
    codePhysical: '126'
  },
  {
    id: 11,
    title: 'Chaves do porão',
    text: 'A máquina do tempo superaqueceu, fornçando uma estada mais longa na capital dos Estados Unidos no início dos anos 1970.',
    nextLocation: 'O que guardo ocupa pouco espaço, mas pode abrir quase todos os outros.',
    codePhysical: '316'
  },
  {
    id: 12,
    title: 'Figurinhas esquecidas',
    text: 'PISTA DO MOTIVO (6 partes) | III. Espírito Santo - sigla.',
    nextLocation: 'Quanto mais completo eu fico, menos você precisa de mim. Meu maior objetivo é deixar de ter espaços vazios.',
    codePhysical: '202'
  },
  {
    id: 13,
    title: 'Flores secas',
    text: 'Durante sua estada na capital americana, a máquina do tempo foi alojada em um galpão ao lado de um estacionamento subterrâneo.',
    nextLocation: 'O que todos admiram vive acima daquilo que ninguém vê. O segredo está onde as raízes permanecem escondidas.',
    codePhysical: '298'
  },
  {
    id: 14,
    title: 'Produtos contaminados',
    text: 'PISTA DO MOTIVO (6 partes) | IV. Tecnologia da Informação - sigla.',
    nextLocation: 'Guardo pequenas rotinas que, quando esquecidas, logo são percebidas pelos outros.',
    codePhysical: '242'
  },
  {
    id: 15,
    title: 'Caixa de cartas rasgadas',
    text: 'PISTA DO MOTIVO (6 partes) | V. Entrega, oferece.',
    nextLocation: 'Guardo palavras que viajaram muito antes de chegar ao destino. Algumas delas continuam importantes mesmo muitos anos depois.',
    codePhysical: '263'
  },
  {
    id: 16,
    title: 'Geladeira quebrada',
    text: 'PISTA DO MOTIVO (6 partes) | VI. Verbo dar no imperativo.',
    nextLocation: 'Sou aberta várias vezes ao dia, mas quase nunca por muito tempo. Quanto menos tempo fico aberta, melhor cumpro meu papel.',
    codePhysical: '356'
  },
  {
    id: 17,
    title: 'Mesa de jantar caída',
    text: 'PISTA DA IDENTIDADE (5 partes) | V. "É elementar, meu caro."',
    nextLocation: 'Sou o ponto de encontro de quem divide o alimento e, às vezes, também os problemas.',
    codePhysical: '224'
  },
  {
    id: 18,
    title: 'Corredor estreito',
    text: 'Durante sua estada em D.C., o Dr. John Watson ficou bastante íntimo de uma mulher que trabalhava na Casa Branca.',
    nextLocation: 'Não sou começo nem fim. Apenas faço a ligação de um lado ao outro.',
    codePhysical: '107'
  }
];

  window.InvestigacaoClues = cluesData;
  window.InvestigacaoGetClueById = function getClueById(id) {
    return cluesData.find((clue) => clue.id === id);
  };
  window.InvestigacaoGetClueByPhysicalCode = function getClueByPhysicalCode(code) {
    return cluesData.find((clue) => clue.codePhysical === code);
  };
})();
