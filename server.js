const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'carolcsb2019',
    database: 'gpc'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Rota para adicionar usuário
app.post('/api/usuarios', (req, res) => {
    const { nome_completo, telefone } = req.body;
    const query = 'INSERT INTO usuario (nome_completo, telefone) VALUES (?, ?)';

    db.query(query, [nome_completo, telefone], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }
        res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
    });
});



// Rota para adicionar um obstáculo
app.post('/api/obstacles', (req, res) => {
    const { endereco } = req.body;

    if (!endereco) {
        return res.status(400).json({ message: 'Endereço é obrigatório.' });
    }

    const query = 'INSERT INTO obstaculos (endereco) VALUES (?)';
    db.query(query, [endereco], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Obstáculo adicionado com sucesso.' });
    });
});

// Rota para buscar todos os obstáculos
app.get('/api/obstacles', (req, res) => {
    const query = 'SELECT * FROM obstaculos';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
