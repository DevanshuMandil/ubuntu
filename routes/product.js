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
    pool.query(`select * from product;`, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
}

router.get('/insert',function(req, res){
    console.log(req.query);
    pool.query(`insert into product set ?`, req.query, function(error, result) {
        if(error) throw error;
        getDataFromDatabase(req, res);
    });
});

router.get('/fetchData', function(req, res) {
    getDataFromDatabase(req, res);
});

router.get('/delete/:id', function(req, res) {
    pool.query(`delete from product where id=${req.params.id}`, function(error, result) {
        if(error) throw error;
        getDataFromDatabase(req, res);
    });
});

router.get('/addProduct',function(req,res){
    res.render('product/product');
});

module.exports = router;