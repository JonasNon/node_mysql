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

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let sql = "INSERT INTO USERS (FIRST_NAME, LAST_NAME) VALUES (?, ?)"
  console.log(req.query[Object.keys(req.query)[0]], req.query[Object.keys(req.query)[1]])
  console.log(req.body.first_name, req.body.last_name)

  let sqlAddress = "INSERT INTO USERSADDRESS (FIRST_NAME, LAST_NAME) VALUES (?, ?)"


  // ??????????????????????????????????????????????????????????



  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [req.body.first_name, req.body.last_name])

  sqlAddress = mysql.format(sqlAddress, [req.body.first_name, req.body.last_name])


  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
    
  })
  // pool.query(sqlAddress, (err, results) => {
  //   if (err) return handleSQLError(res, err)
  //   return res.json({ newId: results.insertId });
  // })
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