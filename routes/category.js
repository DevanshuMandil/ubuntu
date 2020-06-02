const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'food'
});

function getDataFromDatabase(req, res) {
    pool.query(`select * from category;`, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
}

router.get('/addCategory',function(req , res){
    res.render('category/addCategory');
});

router.get('/insert',function(req, res){
    pool.query(`insert into category set ?`, req.query, function(error, result) {
        if(error) throw error;
        getDataFromDatabase(req, res);
    });
});

router.get('/fetchData', function(req, res) {
    getDataFromDatabase(req, res);
});

router.post('/update',function(req,res){
    console.log(req.body);
    pool.guery(`update category set name=${body.name} where id=${body.id}`,function(error,result){
        if(error) throw error;
        getDataFromDatabase(req, res);
     });
});

router.get('/delete/:id', function(req, res) {
    pool.query(`delete from category where id=${req.params.id}`, function(error, result) {
        if(error) throw error;
        getDataFromDatabase(req, res);
    });
});

module.exports = router;