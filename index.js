// Установите пакеты, выполнив:
// npm install axios cheerio google-translate-api fs-extra crypto express body-parser morgan cors dotenv

const axios = require('axios');
const cheerio = require('cheerio');
const translate = require('@vitalets/google-translate-api');
const fs = require('fs-extra');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Конфигурация
const url = 'https://example.com';
const outputFilePath = './output.txt';
const encryptedFilePath = './encrypted_output.txt';
const encryptionKey = process.env.ENCRYPTION_KEY || 'mysecretkey';
const port = process.env.PORT || 3000;

// Функция для шифрования файла
function encryptFile(inputPath, outputPath, key) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
        console.log('File encrypted successfully.');
    });
}

// Основная функция
async function main() {
    try {
        // Загружаем содержимое веб-страницы
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const text = $('body').text();

        // Переводим текст на другой язык (например, на испанский)
        const translation = await translate(text, { to: 'es' });
        const translatedText = translation.text;

        // Сохраняем переведенный текст в файл
        await fs.outputFile(outputFilePath, translatedText);
        console.log('Text saved to file.');

        // Шифруем файл
        encryptFile(outputFilePath, encryptedFilePath, encryptionKey);

        // Создаем HTTP-сервер для отображения результата
        const app = express();

        app.use(bodyParser.json());
        app.use(morgan('combined'));
        app.use(cors());

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/' + encryptedFilePath);
        });

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
