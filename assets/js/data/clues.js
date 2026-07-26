export const clues = [
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

export const getClueById = (id) => clues.find((clue) => clue.id === id);
export const getClueByPhysicalCode = (code) => clues.find((clue) => clue.codePhysical === code);
