const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema de Gestão de Vendas Online funcionando!'
    });
});
app.post('/clientes', (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email) {
        return res.status(400).json({
            erro: 'Nome e e-mail são obrigatórios.'
        });
    }

    const sql = `
        INSERT INTO clientes (nome, email, telefone)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [nome, email, telefone], function (erro) {
        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao cadastrar cliente.'
            });
        }

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            cliente: {
                id: this.lastID,
                nome,
                email,
                telefone
            }
        });
    });
});
// Listar todos os clientes
app.get('/clientes', (req, res) => {
    const sql = `SELECT * FROM clientes`;

    db.all(sql, [], (erro, clientes) => {
        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao listar clientes.'
            });
        }

        res.json(clientes);
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});