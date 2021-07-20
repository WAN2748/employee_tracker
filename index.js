const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password:'@W!ns70n1967',
    database: 'employeeTracker_DB',

});

connection.connect((err) => {
    if (err) throw err;
    runSearch();
})

const runSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all Employees by Department',
          'View all Employees by Manager',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View all Roles',
          'Exit'
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all employees':
            viewAll();
            break;
  
          case 'View all Employees by Department':
            employeeDepartment();
            break;
  
          case 'Add Employee':
            addEmployee();
            break;
  
          case 'Remove Employee':
            removeEmployee();
            break;

          case 'Update Employee Role':
            updateEmployee();
            break;
          case 'View all roles':
              viewRoles();
              break;    
  
          case 'Exit':
            connection.end();
            break;
  
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

const viewAll = () => {
    console.log('viewing all employees...\n');
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        runSearch();
    });
}

const employeeDepartment =() => {
  const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
  FROM employee
  LEFT JOIN role ON role.id = employee.role_id
  LEFT JOIN department ON department.id = role.department_id
  ORDER BY department.name;`;
  connection.query(query, (err, res) => {
      if (err) throw err;
  
      console.table(res);
      runSearch();
  });
};


const addEmployee = () => {
  inquirer
  .prompt([
    {
      name: 'role_id',
      type: 'list',
      choices: [
        'employee',
        'manager'
      ]
    },
    {
      name: 'first_name',
      type: 'input',
      message: 'What is the employee first name?',
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'What is the employee last name?',   
     },

  ])
  .then((answer) => {
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.roleId
      },
      (err, res) => {
        if(err) throw err;
        console.table(res);
        console.log(res.insertedRows + 'Employee Added!');
        runSearch();
      }
    );
  });
};
