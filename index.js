const { Department, Role, Employee } = require("./Models");
const sequelize = require("./connections");
const inquirer = require("inquirer");

sequelize.sync({ force: false }).then(() => {
    options();
});

function options () {
    inquirer
        .promopt([
            {
                types: "list",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add Department",
                    "Add Role",
                    "Add Employee",
                    "Update Employee Role",
                ],
                name: "employeeTracker",
            },
        ])
        .then((answer) => {
            if (answer.employeeTracker === "View All Departments") {
                viewAllDepartments();
            } else if (answer.employeeTracker === "View All Roles") {
                viewAllRoles();
            } else if (answer.employeeTracker === "View All Employees") {
                viewAllEmployees();
            } else if (answer.employeeTracker === "Add Department") {
                addDepartment();
            } else if (answer.employeeTracker === "Add Role") {
                addRole();
            } else if (answer.employeeTracker === "Add Employee") {
                addEmployee();
            } else {
                updateEmployeeRole();
            }
        });
}