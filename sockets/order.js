const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '123',
    database: 'food',
    multipleStatements: true
});

module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.emit('start', {
            key: 'hello world!!!'
        });
        
        socket.on('order', function (data) {
            var sql = "INSERT INTO orders (productid,name,price,offerprice,categoryid,avail,quantity,table_no) VALUES ?;";
            var values = data;
            var sqp2 = `select * from orders where status='pending' order by id DESC limit ${data.length}`;
            pool.query(sql+sqp2, [values], function (err,result) {
                if (err) throw err;
                   io.emit('newOrders', result);
            });
        });

        socket.on('statusChanged', function(data){
            socket.broadcast.emit('statusChanged',data);
        });
     
    });
};