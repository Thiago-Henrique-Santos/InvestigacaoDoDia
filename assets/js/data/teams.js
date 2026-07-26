export const teams = [
  {
    id: 'marrom',
    name: 'Equipe Marrom',
    password: 'âmbar',
    order: [8, 4, 16, 2, 12, 6, 14, 1, 9, 11, 3, 15, 7, 10, 13, 5, 17, 18],
    finalPassword: 'bosta'
  },
  {
    id: 'cinza',
    name: 'Equipe Cinza',
    password: 'narval',
    order: [3, 10, 1, 17, 5, 13, 9, 18, 7, 14, 2, 16, 8, 12, 6, 15, 4, 11],
    finalPassword: 'pum'
  }
];

export const getTeams = () => teams;
export const getTeamById = (teamId) => teams.find((team) => team.id === teamId);
