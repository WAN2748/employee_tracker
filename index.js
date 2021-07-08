const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user:'root',
    password:'@W!ns70n1967',
    database: 'employee_tracker',

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
  
          case 'Find an employee by department':
            employeeDepartment();
            break;
  
          case 'Add an employee':
            addEmployee();
            break;
  
          case 'Remove an employee':
            removeEmployee();
            break;

          case 'Update employee':
            updateEmployee();
            break;
          case 'View roles':
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

const viewAll = (employee) => {
    console.log('viewing all employees...\n');
    connection.query('SELECT * FROM employeeTracker', {
        employee: employee
    }, (err, res) => {
        if (err) throw err;
        console.log(res);
    })
}

const employeeDepartment =(employeeDep) => {
  console.log('Viewing Departments...\n');
  connection.query('SELECT * FROM department', {
    department: department
  }, (err, res) => {
    if (err) throw err;
    console.log(res);
  })
}

const addEmployee = () => {
  inquirer
  .prompt([
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
    {
      name: 'role_id',
      type: 'list',
      choices: [
        'employee',
        'manager'
      ]
    }
  ])
  .then((answer) => {
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id
      },
      (err) => {
        if(err) throw err;
        console.log('Employee Added!');
        runSearch();
      }
    );
  });
};
