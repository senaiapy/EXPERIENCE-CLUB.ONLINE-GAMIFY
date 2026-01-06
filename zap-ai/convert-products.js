const fs = require('fs');
const path = require('path');

// Read the source SQL file
const sourceFile = path.join(__dirname, 'Product_clubofertas.sql');
const targetFile = path.join(__dirname, 'products.clubofertas.sql');

const content = fs.readFileSync(sourceFile, 'utf8');

// Extract all INSERT statements
const insertRegex = /INSERT INTO "Product_clubofertas" \([^)]+\) VALUES\s*([\s\S]*?);/g;
const matches = [...content.matchAll(insertRegex)];

let allProducts = [];

// Parse each INSERT statement
matches.forEach(match => {
  const valuesSection = match[1];

  // Split by rows (handling multi-line entries)
  const rows = [];
  let currentRow = '';
  let parenDepth = 0;
  let inString = false;
  let stringChar = null;

  for (let i = 0; i < valuesSection.length; i++) {
    const char = valuesSection[i];
    const prevChar = i > 0 ? valuesSection[i - 1] : '';

    // Track string state
    if ((char === "'" || char === '"') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }

    // Track parentheses depth (only when not in string)
    if (!inString) {
      if (char === '(') parenDepth++;
      if (char === ')') parenDepth--;

      // End of row
      if (parenDepth === 0 && char === ')') {
        currentRow += char;
        rows.push(currentRow.trim());
        currentRow = '';
        // Skip comma and whitespace
        while (i + 1 < valuesSection.length && (valuesSection[i + 1] === ',' || valuesSection[i + 1].match(/\s/))) {
          i++;
        }
        continue;
      }
    }

    currentRow += char;
  }

  // Parse each row
  rows.forEach(row => {
    if (!row.startsWith('(') || !row.endsWith(')')) return;

    // Remove outer parentheses
    const values = row.slice(1, -1);

    // Parse values manually
    const fields = [];
    let current = '';
    let depth = 0;
    let inStr = false;
    let strChar = null;

    for (let i = 0; i < values.length; i++) {
      const char = values[i];
      const prevChar = i > 0 ? values[i - 1] : '';

      if ((char === "'" || char === '"') && prevChar !== '\\') {
        if (!inStr) {
          inStr = true;
          strChar = char;
        } else if (char === strChar) {
          inStr = false;
          strChar = null;
        }
      }

      if (!inStr) {
        if (char === '(' || char === '[') depth++;
        if (char === ')' || char === ']') depth--;

        if (char === ',' && depth === 0) {
          fields.push(current.trim());
          current = '';
          continue;
        }
      }

      current += char;
    }
    if (current.trim()) fields.push(current.trim());

    // Map fields according to INSERT statement order:
    // id, name, slug, description, price, stock, referenceId, specifications, details,
    // price_sale, stockStatus, stockQuantity, image_name, brand_name, tags, isFeatured, createdAt, updatedAt
    if (fields.length >= 14) {
      const id = fields[0].replace(/^'|'$/g, '');
      const title = fields[1].replace(/^'|'$/g, '').replace(/''/g, "'");
      const price = fields[9].replace(/^'|'$/g, ''); // price_sale
      const foto = fields[12].replace(/^'|'$/g, ''); // image_name
      const marca = fields[13].replace(/^'|'$/g, ''); // brand_name
      const categoria = fields[6].replace(/^'|'$/g, ''); // referenceId (used as categoryId based on context)

      allProducts.push({ id, title, price, foto, marca, categoria });
    }
  });
});

console.log(`Parsed ${allProducts.length} products`);

// Generate the output SQL
let output = `-- Converted products from Product_clubofertas.sql
-- Total products: ${allProducts.length}
-- Field mappings:
--   id -> id (string)
--   name -> title
--   price_sale -> price (string)
--   image_name -> foto
--   brand_name -> marca
--   categoryId -> categoria

CREATE TABLE IF NOT EXISTS products_clubofertas (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    price VARCHAR(255),
    foto VARCHAR(255),
    marca VARCHAR(255),
    categoria VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

`;

// Insert in batches of 100
const batchSize = 100;
for (let i = 0; i < allProducts.length; i += batchSize) {
  const batch = allProducts.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;

  output += `-- Batch ${batchNum} (${batch.length} products)\n`;
  output += `INSERT INTO products_clubofertas (id, title, price, foto, marca, categoria) VALUES\n`;

  batch.forEach((product, idx) => {
    const isLast = idx === batch.length - 1;
    const comma = isLast ? ';' : ',';

    // Escape single quotes in title
    const safeTitle = product.title.replace(/'/g, "''");
    const safeMarca = product.marca.replace(/'/g, "''");

    output += `    ('${product.id}', '${safeTitle}', '${product.price}', '${product.foto}', '${safeMarca}', '${product.categoria}')${comma}\n`;
  });

  output += `\n`;
}

// Write the output file
fs.writeFileSync(targetFile, output, 'utf8');
console.log(`✓ Created ${targetFile}`);
console.log(`✓ Converted ${allProducts.length} products with field mappings:`);
console.log('  - id -> id (string)');
console.log('  - name -> title');
console.log('  - price_sale -> price (string)');
console.log('  - image_name -> foto');
console.log('  - brand_name -> marca');
console.log('  - categoryId -> categoria');
