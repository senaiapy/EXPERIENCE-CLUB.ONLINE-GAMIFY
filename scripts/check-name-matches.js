#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const lista = JSON.parse(fs.readFileSync(path.join(__dirname, '../products/lista.json'), 'utf-8'));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../products/products.json'), 'utf-8'));

console.log('=== Sample from lista.json (with empty fields) ===');
const emptyProducts = lista.filter(p => !p.category || !p.tags).slice(0, 5);
emptyProducts.forEach(p => {
  console.log('ID:', p.id, '| RefID:', p.referenceId, '| Name:', p.name.substring(0, 80));
});

console.log('\n=== Sample from products.json ===');
products.slice(0, 5).forEach(p => {
  console.log('ID:', p.id, '| RefID:', p.referenceId, '| Name:', p.name.substring(0, 80));
});

console.log('\n=== Check if any names match ===');
const listaNames = new Set(lista.map(p => p.name.trim().toLowerCase()));
const productsNames = new Set(products.map(p => p.name.trim().toLowerCase()));
const matches = [...listaNames].filter(name => productsNames.has(name));
console.log('Matching names found:', matches.length);
if (matches.length > 0) {
  console.log('Sample matches:', matches.slice(0, 5));
}

console.log('\n=== Check referenceId matches ===');
const listaRefs = new Set(lista.map(p => p.referenceId).filter(Boolean));
const productsRefs = new Set(products.map(p => p.referenceId).filter(Boolean));
const refMatches = [...listaRefs].filter(ref => productsRefs.has(ref));
console.log('Matching referenceIds found:', refMatches.length);
