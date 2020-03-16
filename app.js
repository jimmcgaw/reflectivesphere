const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

app.use('/static', express.static('node_modules'));
app.use('/static', express.static('static'));
app.use(express.static('templates'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(port, () => console.log(`Now running at http://localhost:${port}/`));