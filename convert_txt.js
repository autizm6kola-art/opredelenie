const fs = require('fs');
const path = require('path');

// === НАСТРОЙКИ ===
const INPUT_FILE = path.join(__dirname, 'source.txt');
const OUTPUT_FILE = path.join(__dirname, 'output.txt');
const ITEMS_PER_PAGE = 5;
const DIVIDER = '____________________________________________________________';

// === ЧТЕНИЕ ФАЙЛА ===
const rawText = fs.readFileSync(INPUT_FILE, 'utf-8');

// === ПАРСИНГ СТРОК ===
let lines = rawText
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean)
  .map(line => {
    // убираем "1 | "
    const parts = line.split('|');
    return parts.length > 1 ? parts[1].trim() : line;
  });

// === ПЕРЕМЕШИВАНИЕ (Fisher–Yates) ===
for (let i = lines.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [lines[i], lines[j]] = [lines[j], lines[i]];
}

// === РАЗБИВКА НА СТРАНИЦЫ ===
let pages = [];
for (let i = 0; i < lines.length; i += ITEMS_PER_PAGE) {
  pages.push(lines.slice(i, i + ITEMS_PER_PAGE));
}

// === ФОРМИРОВАНИЕ ВЫХОДНОГО ТЕКСТА ===
let result = '';

pages.forEach((page, index) => {
  result += `--- PAGE START ---\n`;
  result += `#TITLE: ${index + 1}\n`;

  page.forEach(line => {
    result += `${line}\n`;
    result += `${DIVIDER}\n`;
  });

  result += `--- PAGE END ---\n\n`;
});

// === ЗАПИСЬ ФАЙЛА ===
fs.writeFileSync(OUTPUT_FILE, result, 'utf-8');

console.log('✅ Готово! Файл output.txt создан.');
