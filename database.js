const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vendas.db', (erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco:', erro.message);
    } else {
        console.log('Banco de dados conectado com sucesso!');
    }
});

db.run(`
    
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        estoque INTEGER NOT NULL
    )
`);
module.exports = db;