const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('order/order');
});

router.get('/orderCart', function(req, res){
    res.render('order/orderCart');
});

module.exports = router;