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
// Cadastrar produto
app.post('/produtos', (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;

    if (!nome || preco === undefined || estoque === undefined) {
        return res.status(400).json({
            erro: 'Nome, preço e estoque são obrigatórios.'
        });
    }

    const sql = `
        INSERT INTO produtos (nome, descricao, preco, estoque)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [nome, descricao, preco, estoque], function (erro) {
        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao cadastrar produto.'
            });
        }

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso!',
            produto: {
                id: this.lastID,
                nome,
                descricao,
                preco,
                estoque
            }
        });
    });
});
// Listar todos os produtos
app.get('/produtos', (req, res) => {
    const sql = `SELECT * FROM produtos`;

    db.all(sql, [], (erro, produtos) => {
        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao listar produtos.'
            });
        }

        res.json(produtos);
    });
});
// Cadastrar um novo pedido
app.post('/pedidos', (req, res) => {
    const { cliente_id, produto_id, quantidade, forma_pagamento } = req.body;

    // Buscar o produto para calcular o valor total
    db.get(
        `SELECT * FROM produtos WHERE id = ?`,
        [produto_id],
        (erro, produto) => {
            if (erro) {
                return res.status(500).json({
                    erro: 'Erro ao buscar produto.'
                });
            }

            if (!produto) {
                return res.status(404).json({
                    erro: 'Produto não encontrado.'
                });
            }

            const valor_total = produto.preco * quantidade;

            const sql = `
                INSERT INTO pedidos
                (cliente_id, produto_id, quantidade, valor_total, forma_pagamento)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(
                sql,
                [cliente_id, produto_id, quantidade, valor_total, forma_pagamento],
                function (erro) {
                    if (erro) {
                        return res.status(500).json({
                            erro: 'Erro ao cadastrar pedido.'
                        });
                    }

                    res.status(201).json({
                        mensagem: 'Pedido cadastrado com sucesso!',
                        pedido: {
                            id: this.lastID,
                            cliente_id,
                            produto_id,
                            quantidade,
                            valor_total,
                            forma_pagamento,
                            status: 'Pendente'
                        }
                    });
                }
            );
        }
    );
});
// Listar todos os pedidos
app.get('/pedidos', (req, res) => {
    const sql = `
        SELECT
            pedidos.id,
            clientes.nome AS cliente,
            produtos.nome AS produto,
            pedidos.quantidade,
            pedidos.valor_total,
            pedidos.forma_pagamento,
            pedidos.status,
            pedidos.data_pedido
        FROM pedidos
        INNER JOIN clientes ON clientes.id = pedidos.cliente_id
        INNER JOIN produtos ON produtos.id = pedidos.produto_id
        ORDER BY pedidos.id DESC
    `;

    db.all(sql, [], (erro, pedidos) => {
        if (erro) {
            return res.status(500).json({
                erro: 'Erro ao listar pedidos.'
            });
        }

        res.json(pedidos);
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});