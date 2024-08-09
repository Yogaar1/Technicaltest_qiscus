const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Route untuk menyajikan file HTML utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/saveMessage', (req, res) => {
    const { sender, message } = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        let jsonData = JSON.parse(data);

        // Tambahkan pesan baru ke data
        jsonData.results.comments.push({ sender, message });

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }

            res.status(200).send('Message saved');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
