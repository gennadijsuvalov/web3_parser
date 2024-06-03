# Web3 Parser

This script demonstrates a variety of tasks such as fetching web content, extracting text, translating it, saving to a file, encrypting the file, and serving the result via an HTTP server using 10 different npm packages.

## How It Works

1. **Fetching Web Content**: Uses the `axios` package to download the content of a webpage.
2. **Extracting Text from HTML**: Utilizes the `cheerio` package to parse HTML and extract text.
3. **Translating Text**: Employs the `google-translate-api` package to translate the text to another language (e.g., Spanish).
4. **Saving Translated Text to a File**: Uses the `fs-extra` package to write the translated text to a file.
5. **Encrypting the File**: Uses the `crypto` package to encrypt the file.
6. **Creating an HTTP Server**: Uses the `express`, `body-parser`, `morgan`, and `cors` packages to create and configure an HTTP server.
7. **Environment Configuration**: Uses the `dotenv` package to manage environment variables.

## Usage

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/repository-name.git
    cd repository-name
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Create a `.env` File**:
    Create a `.env` file in the root directory with the following content:
    ```env
    ENCRYPTION_KEY=mysecretkey
    PORT=3000
    ```

4. **Run the Script**:
    ```bash
    node script.js
    ```

## Example Script

```javascript
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

const url = 'https://example.com';
const outputFilePath = './output.txt';
const encryptedFilePath = './encrypted_output.txt';
const encryptionKey = process.env.ENCRYPTION_KEY || 'mysecretkey';
const port = process.env.PORT || 3000;

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

async function main() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const text = $('body').text();
        const translation = await translate(text, { to: 'es' });
        const translatedText = translation.text;

        await fs.outputFile(outputFilePath, translatedText);
        console.log('Text saved to file.');

        encryptFile(outputFilePath, encryptedFilePath, encryptionKey);

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
