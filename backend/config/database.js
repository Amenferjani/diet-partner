const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'db-diet-partner.c28qqizrcou2.eu-north-1.rds.amazonaws.com',
//   user: 'admin',
//   password: 'GAMRATITAaviron123456#',
//   database: 'diet_partner',
//   port: 3306, 
//   ssl: 'Amazon RDS'
// });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'diet-partner',
});

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

