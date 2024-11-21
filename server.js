const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Rota para adicionar usuário
app.post('/cadastro', (req, res) => {
    const { nome, telefone } = req.body;

    const query = 'INSERT INTO usuario (nome_completo, telefone) VALUES (?, ?)';
    db.query(query, [nome, telefone], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados: ', err);
            res.status(500).send('Erro ao cadastrar.');
        }
        else{
            console.log('Dados inseridos com sucesso: ', result);
            res.send('Cadastro realizado com sucesso!');
        }
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
        if (err) {
            console.error('Erro ao adicionar obstáculo:', err);
            return res.status(500).json({ message: 'Erro ao adicionar obstáculo.' });
        }
        res.status(201).json({ message: 'Obstáculo adicionado com sucesso.' });
    });
});

// Rota para buscar todos os obstáculos
app.get('/api/obstacles', (req, res) => {
    const query = 'SELECT * FROM obstaculos';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar obstáculos:', err);
            return res.status(500).json({ message: 'Erro ao buscar obstáculos.' });
        }
        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
