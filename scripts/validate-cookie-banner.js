#!/usr/bin/env node

/**
 * Script de validação para garantir que o banner de cookies
 * está presente no build final
 */

const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');

// Define o caminho para o arquivo index.html do build
const indexPath = path.join(__dirname, '../build/index.html');

// Verifica se o arquivo existe
if (!fs.existsSync(indexPath)) {
  console.error(colors.red('Erro: Arquivo index.html não encontrado no build!'));
  process.exit(1);
}

// Lê o conteúdo do arquivo
const htmlContent = fs.readFileSync(indexPath, 'utf8');

// Elementos a verificar
const elementsToCheck = [
  { name: 'Cookie Banner', id: 'cookieConsent', class: 'cookie-banner' },
  { name: 'Cookie Settings Modal', id: 'cookieModal', class: 'cookie-modal' },
  { name: 'Accept All Button', id: 'cookieAcceptAll' },
  { name: 'Settings Button', id: 'cookieSettings' },
  { name: 'Save Settings Button', id: 'saveCookieSettings' }
];

  // Verifica a presença de cada elemento
let allPresent = true;
console.log(colors.blue('\nValidando Banner de Cookies no HTML:'));
console.log(colors.blue('========================================='));

elementsToCheck.forEach(element => {
  // Busca por padrões mais flexíveis, sem aspas específicas
  const idRegex = new RegExp(`id\\s*=\\s*['"\\s]?${element.id}['"\\s]?`, 'i');
  const classRegex = element.class ? new RegExp(`class\\s*=\\s*['"\\s]?.*${element.class}.*['"\\s]?`, 'i') : null;
  
  const idPresent = idRegex.test(htmlContent);
  const classPresent = element.class ? classRegex.test(htmlContent) : true;
  
  if (idPresent && classPresent) {
    console.log(colors.green(`✓ ${element.name} encontrado no HTML`));
  } else {
    console.log(colors.red(`✗ ${element.name} NÃO encontrado no HTML`));
    allPresent = false;
  }
});// Verifica se o JavaScript para o banner de cookies está presente
const cookieJsRegex = /cookieBanner|cookieConsent|setCookieChoices/;
const jsPresent = cookieJsRegex.test(htmlContent);

if (jsPresent) {
  console.log(colors.green('✓ Código JavaScript para cookies encontrado'));
} else {
  console.log(colors.red('✗ Código JavaScript para cookies NÃO encontrado'));
  allPresent = false;
}

// Verifica o CSS para o banner de cookies
const cookieCssRegex = /cookie-banner|cookie-modal|cookie-content/;
const cssPresent = cookieCssRegex.test(htmlContent);

if (cssPresent) {
  console.log(colors.green('✓ Estilos CSS para cookies encontrados'));
} else {
  console.log(colors.red('✗ Estilos CSS para cookies NÃO encontrados'));
  allPresent = false;
}

console.log(colors.blue('========================================='));

if (allPresent) {
  console.log(colors.green('✓ Validação concluída com sucesso! O banner de cookies está presente no build.'));
  process.exit(0);
} else {
  console.error(colors.red('✗ Validação falhou! Alguns elementos do banner de cookies estão faltando.'));
  process.exit(1);
}
