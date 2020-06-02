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
    pool.query(`select * from chef;`, function (error, result) {
        if (error) throw error;
        console.log(result);
        res.json(result);
    });
}

router.get('/insert', function (req, res) {
    console.log(req.query);
    pool.query(`insert into chef set ?`, req.query, function (error, result) {
        if (error) throw error;
        getDataFromDatabase(req, res);
    });
});

router.get('/fetchData', function (req, res) {
    getDataFromDatabase(req, res);
});

router.get('/delete/:id', function (req, res) {
    pool.query(`delete from chef where id=${req.params.id}`, function (error, result) {
        if (error) throw error;
        getDataFromDatabase(req, res);
    });
});

router.get('/getOrders/:id', function (req, res) {    
    pool.query(`select * from orders where categoryid=${req.params.id}`, function (error, result) {
        if (error) throw error;
        res.json(result);
    });
});

router.get('/addchef', function (req, res) {
    res.render('chef/chef');
});

router.get('/chefLogin', function (req, res) {
    res.render('chef/chefLogin');
});

module.exports = router;