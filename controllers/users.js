const mysql = require('mysql')
const pool = require('../sql/connection')
const body = require('body-parser')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS
  pool.query("SELECT * FROM USERS INNER JOIN USERSADDRESS ON USERS.ID = USERSADDRESS.ID JOIN USERSCONTACT ON USERS.ID = USERSCONTACT.ID", (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}
//  INNER JOIN USERSCONTACT WHERE USERS.ID = USERSCONTACT.ID
const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  let sql = "SELECT * FROM USERS WHERE ID = ? "
  let id = req.params.id
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [id])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

// const createUser = (req, res) => {
//   // INSERT INTO USERS FIRST AND LAST NAME 
//   let sql = "INSERT INTO USERS (FIRST_NAME, LAST_NAME) VALUES (?, ?)"
//   console.log(req.query[Object.keys(req.query)[0]], req.query[Object.keys(req.query)[1]])
//   console.log(req.body.first_name, req.body.last_name)

//   let sqlAddress = "INSERT INTO USERSADDRESS (FIRST_NAME, LAST_NAME) VALUES (?, ?)"


//   let multiSQL = "INSERT INTO GeekTable1 (Id1, Name1, City1) OUTPUT inserted.Id1, inserted.Name1, inserted.City1 INTO GeekTable2 VALUES (1, 'Komal', 'Delhi'), (2, 'Khushi', 'Noida');"

//   // ??????????????????????????????????????????????????????????



//   // WHAT GOES IN THE BRACKETS
//   sql = mysql.format(sql, [req.body.first_name, req.body.last_name])

//   sqlAddress = mysql.format(sqlAddress, [req.body.first_name, req.body.last_name])


//   pool.query(sql, (err, results) => {
//     if (err) return handleSQLError(res, err)
//     return res.json({ newId: results.insertId });
    
//   })
//   // pool.query(sqlAddress, (err, results) => {
//   //   if (err) return handleSQLError(res, err)
//   //   return res.json({ newId: results.insertId });
//   // })
// }

const createUser = (req, res) => {
  let sql1 = "INSERT INTO users (??, ??) VALUES (?, ?);";
  let sql2 = "INSERT INTO usersContact (??, ??, ??, ??) VALUES (?, ?, ?, ?);";
  let sql3 = "INSERT INTO usersAddress (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?);";
  
  sql1 = mysql.format(sql1, ["first_name", "last_name", req.body.first_name, req.body.last_name]);

  pool.query(sql1, (err, results) => {
    if (err) {
      console.error("Error executing SQL Query 1:", err);
      return handleSQLError(res, err);
    }
    const userId = results.insertId;

    // Prepare and execute sql2 using userId
    sql2 = mysql.format(sql2, ["user_id", "phone1", "phone2", "email", userId, req.body.phone1, req.body.phone2, req.body.email]);
    pool.query(sql2, (err, results) => {
      if (err) {
        console.error("Error executing SQL Query 2:", err);
        return handleSQLError(res, err);
      }
      
      // Prepare and execute sql3 using userId
      sql3 = mysql.format(sql3, ["user_id", "address", "city", "county", "state", "zip", userId, req.body.address, req.body.city, req.body.county, req.body.state, req.body.zip]);
      pool.query(sql3, (err, results) => {
        if (err) {
          console.error("Error executing SQL Query 3:", err);
          return handleSQLError(res, err);
        }
        return res.json({ newId: userId });
      });
    });
  });
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let sql = "UPDATE USERS SET FIRST_NAME = ?, LAST_NAME = ? WHERE ID = ?"
  let id = req.params.id
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name, id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = "DELETE FROM USERS WHERE FIRST_NAME = ?"
  // WHAT GOES IN THE BRACKETS
  // console.log(req.params.first_name)
  sql = mysql.format(sql, [req.params.first_name])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}