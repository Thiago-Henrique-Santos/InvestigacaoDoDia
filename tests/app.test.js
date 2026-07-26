const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const appPath = path.join(root, 'assets', 'js', 'app.js');
const teamsPath = path.join(root, 'assets', 'js', 'data', 'teams.js');
const casePath = path.join(root, 'assets', 'js', 'data', 'case.js');
const authPath = path.join(root, 'assets', 'js', 'services', 'auth.js');

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const appJs = fs.readFileSync(appPath, 'utf8');
const teamsJs = fs.readFileSync(teamsPath, 'utf8');
const caseJs = fs.readFileSync(casePath, 'utf8');

test('o HTML carrega scripts estáticos sem módulos', () => {
  assert.match(indexHtml, /<script src="assets\/js\/data\/teams\.js"><\/script>/);
  assert.match(indexHtml, /<script src="assets\/js\/app\.js"><\/script>/);
  assert.doesNotMatch(indexHtml, /type="module"/);
});

test('o app não usa imports/exports e lê as equipes de teams.js', () => {
  assert.doesNotMatch(appJs, /import\s+/);
  assert.doesNotMatch(appJs, /export\s+/);
  assert.match(appJs, /window\.InvestigacaoGetTeams|window\.InvestigacaoTeams/);
  assert.equal(fs.existsSync(authPath), false);
});

test('as senhas permanecem centralizadas em teams.js', () => {
  assert.match(teamsJs, /password: 'âmbar'/);
  assert.match(teamsJs, /password: 'narval'/);
  assert.doesNotMatch(teamsJs, /marrom-2026|cinza-2026/);
});

test('a validação do código da pista normaliza o valor antes de comparar', () => {
  assert.match(appJs, /normalizeCodeValue|inputmode="numeric"|validate-code" type="text"/);
});

test('o caso é carregado de um arquivo próprio e exibido na modal', () => {
  assert.match(indexHtml, /assets\/js\/data\/case\.js/);
  assert.match(appJs, /window\.InvestigacaoGetCase|openCaseModal/);
  assert.match(caseJs, /title:|story:|base/);
});
