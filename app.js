const express = require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')

const app = express ();

const PORT = process.env.PORT ||5001;

const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'aluno',
    password:'ifpecjbg',
    database:'teste'
})

connection.connect((err)=> {
    if (err) {
        console.error('Erro ao conenctar no MySQL: '+ err.message)
    }
    else{
        console.log('Conectado ao MySQL')
    }
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/api/usuarios', (req, res)=> {
    const{email,senha} =  req.body;
    
    const sql = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)'
    connection.query(sql,[email, senha], (err, results) => {
        if(err){
            console.error('Erro ao inserir registro: '+err.message)
            res.status(500).json({error:'ERRO ao inserir registro'})
        }
        else{
            console.log('Registro inserido com sucesso!')
            res.status(201).json({message: 'Registro inserido com sucesso'})
        }
    });
});

app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar registro: ',err+message)
            res.status(500).json({error:' Erro ao buscar registros'})
        }
        else{
            res.status(200).json(results)
        }
    })
})

app.put('/api/usuarios/:id', (req, res) =>{
    const { id } = req.params
    const { email, senha } = req.body;

    const sql = 'UPDATE usuarios SET email = ?, senha = ? WHERE id = ?';
    connection.query(sql, [email, senha, id], (err, result) => {
        if (err){
            console.error('Erro ao atualizar registro: '+err.message)
            res.status(500).json({error:'Erro ao atualizar registro'})
        }
        else {
            console.log('Registro atualizado com sucesso!')
            res.status(200).json({message:'Registro atualizado com sucesso'})
        }
    })
})

app.delete('/api/usuarios/:id', (req, res) =>{
    const { id } = req.params
    
    const sql = 'DELETE FROM usuarios WHERE id = ?'
    connection.query(sql, [id], (err, result) =>{
        if (err){
            console.error('Erro ao excluir registro: '+ err.message)
            res.status(500).json({message:'ERRO ao excluido com registro'})
        }
        else {
            if (result.affectedRows > 0){
                console.log('registro excluido com sucesso')
                res.status(200).json({message: 'Registro excluido com sucesso'})
            }
            else {
                console.log('Registro nao encontrado')
                res.status(404).json({message: 'Registro nao encntrado'})
            }
        }
    })
})
app.listen(PORT, console.log(`Servidor iniciado na porta ${PORT}`))