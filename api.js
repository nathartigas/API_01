//requires
const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

//IMPORTS
const mysql_config = require('./imp/functions')
const functions = require('./imp/functions')
const { Connection } = require('mysql2/typings/mysql/lib/Connection')

//variaveis para disponibilidade e para versionamento
const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';

//iniciar servidor
const app = express();
app.listen(3000,()=>{
    console.log('API esta executando');
})

//verificar a disponibilidade da API
app.use((req,res,next)=>{
    if(API_AVAILABILITY){
        next()
    }else{
        res.json(functions.response('atenção','API esta em manuteção',0,null))
    }
})

//conexao com mysql
const connections = mysql.createConnection(mysql_config)

//cors
app.use(cors())

//rotas
//rota inicial (entrada)
app.get('/',(req,res)=>{
    res.json(functions.response ('sucesso','API esta rodando',0,null))
})
//endpoint
//rota para a consulta completa
app.get('./tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err,rows)=>{
        if(err){
            res.json(functions.response('sucesso','sucesso na consulta',rows.length,rows))
        }else{
            res.json(functions.response('erro',err.message,0,null))
        }
    })
})

//rota para fazer uma consulta de task por id
app.get('/tasks/id',(req,res)=>{
    const id =req.params.id
    connection.query('SELECT * FROM tasks WHERE id = ?',[id],(err,rows)=>{
        if(err){
            if(rows.length>0){
            res.json(functions.response('sucesso','sucesso na pesquisa',rows.length,rows))
            }else{
                res.json(functions.response('atnção','nao foi encontrada a task selecionada',0,null))
            }
        }else{
            res.json(functions.response('erro',err.message,0,null))
        }
    })
})

//rota para atualizar o status da  task pelo id selecionado
app.put('/tasks/:id/status/:status',(req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status =? WHERE id=?',[status,id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response ('sucesso','sucesso na alteração do status',rows.affectedRows,null))
            }else{
                res.json(functions.response ('alerta vermelho','task nao',rows.affectedRows,0,null))
            }
        }else{
            res.json(functions.response ('erro',err.message,0,null))
        }
    })
})



//tratar o erroo da rota
app.use((req,res)=>{
    res.json(functions.response('atenção','nao encontrado',0,null))
})