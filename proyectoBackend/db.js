const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  port:34044,
  password: 'qbWqCRKHgfHvyGRpFGjtNpmKuLPmMXat', 
  database: 'railway'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

module.exports = connection;