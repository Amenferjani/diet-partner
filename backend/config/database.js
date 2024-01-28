const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'amazon host',
//   user: 'admin',
//   password: 'your password',
//   database: 'diet_partner',
//   port: 3306, 
//   ssl: 'Amazon RDS'
// });

// Test the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Export the connection for use in controllers
module.exports = connection;

