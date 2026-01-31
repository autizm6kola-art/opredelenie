const fs = require('fs');

// Путь к файлу, который будет создан
const filePath = './numbers.txt';

// Создаем пустой файл (если он не существует) и записываем данные
const writeStream = fs.createWriteStream(filePath);

// Цикл от 1 до 1000
for (let i = 1; i <= 10000; i++) {
  // Записываем строку с номером и разделителем "|"
  writeStream.write(`${i} |\n`);
}

// Закрываем поток записи
writeStream.end();

writeStream.on('finish', () => {
  console.log(`Файл ${filePath} успешно создан!`);
});
