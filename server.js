const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');


//this is connecting the local user me to mysql
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '9487715Se8hq56R!',
    database: 'employeetracker_db'
  },
);
db.query = util.promisify(db.query) //this promisifys db.query

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the departments database.');
  startApp(); 
});

async function startApp() {
 const data = await inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "decision",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
      }
    ])
      switch (data.decision) {
        case "View All Departments":
           viewDepartments();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
           addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Update Employee Role":
          employeeRole();
          break;

        case "Quit":
          console.log("Exiting the application.");
          db.end(); // ends the inquirer
          break;
      }
    }
 
  


// Function to view all departments
async function viewDepartments() {
  try {
    const [rows] = await db.promise().query('SELECT * FROM department');
    console.table(rows);
    startApp(); // Restart the prompt
  } catch (error) {
    console.error('Error viewing departments: ' + error);
    startApp(); // Restart the prompt
  }
}

// Function to view all employees
async function viewEmployees() {
  try {
    const sql = `SELECT employees.id, employees.first_name AS "first name", employees.last_name 
    AS "last name", roles.title, department.department_name AS department, roles.salary, 
    concat(manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department.id
    LEFT JOIN employees manager
    ON manager.id = employees.manager_id`
    const [rows] = await db.promise().query(sql);
    console.table(rows);
    startApp(); // Restart the prompt
  } catch (error) {
    console.error('Error viewing employees: ' + error);
    startApp(); // Restart the prompt
  }
}

// Function to view all roles
async function viewRoles() {
  try {
    const [rows] = await db.promise().query('select * from roles inner join department on roles.department_id = department.id');
    console.table(rows);
    startApp(); // Restart the prompt
  } catch (error) {
    console.error('Error viewing roles: ' + error);
    startApp(); // Restart the prompt
  }
}

async function addEmployee(){
 const roles = await db.query('SELECT id AS value, title AS name FROM roles')
 const managers = await db.query('select id as value, concat(first_name," ",last_name) as name from employees')
  const res = await inquirer
  .prompt([
    {
      type: 'input',
      message: 'Please enter the employees firts name',
      name: 'firstname',
    },
    {
      type: 'input',
      message: 'Please enter the employees last name',
      name: 'lastname',
    },
    {
      type: 'list',
      message: 'Please enter the employees role',
      name: 'eRole',
      choices: roles,
    },
    {
      type: 'list',
      message: 'Please enter the employees manager',
      name: 'manager',
      choices: managers,
    },
  ])
   await db.query('insert into employees (first_name, last_name, role_id, manager_id) values (?,?,?,?)', [res.firstname, res.lastname, res.eRole, res.manager]);
   console.log('We added your employee!')
   startApp();
};

async function addRole(){
  const departments = await db.query('select id as value, department_name as name from department');
   const res = await inquirer
          .prompt([
            {
              type: 'input',
              message: 'Please enter a role name.',
              name: 'roleName',
            },
            {
              type: 'input',
              message: 'Please enter the salary',
              name: 'salary',
            },
            {
              type: 'list',
              message: 'Please enter the department for the role.',
              name: 'roleDepartment',
              choices: departments,
            }
          ])
          await db.query('insert into roles (title, salary, department_id) values (?,?,?)', [res.roleName, res.salary, res.roleDepartment]);
          console.log('role was added!');
          startApp();
};

async function addDepartment(){
 const res = await inquirer
  .prompt([
    {
      type: 'input',
      message: 'Please enter the name of the department.',
      name: 'departmentName'
    }
  ])
  await db.query('insert into department (department_name) values (?) ', [res.departmentName]);
  console.log('Department was added!');
  startApp();
}

async function employeeRole(){
  const roles = await db.query('SELECT id AS value, title AS name FROM roles')
 const employees = await db.query('select id as value, concat(first_name," ",last_name) as name from employees')
 const res = await inquirer
  .prompt([
    {
      type: 'list',
      message: 'Which employee is changing roles?',
      name: 'employee',
      choices: employees,
    },
    {
      type: 'list',
      message: 'Please enter the employees role',
      name: 'eRole',
      choices: roles,
    },
  ])
  await db.query('update employees set role_id = ? where id = ?', [res.eRole, res.employee]);
  console.log('Your employee was updated!');
  startApp();
}