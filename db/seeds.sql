-- Insert into department table
INSERT INTO department (department_name)
VALUES 
('Management'),
('Sales'),
('Administration'),
('Accounting'),
('Product Oversight'),
('Warehouse');

-- Insert into roles table
INSERT INTO roles (title, salary, department_id)
VALUES 
('Regional Manager', 60000, 1),
('Sales Representative', 44000, 2),
('Receptionist', 25000, 3),
('Senior Accountant', 67000, 4),
('Accountant', 50000, 4),
('Supplier Relations Representative', 44000, 5),
('Warehouse Foreman', 40000, 6);

-- Insert into employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Michael', 'Scott', 1, NULL),
('Jim', 'Halpert', 2, 1),
('Pam', 'Beesly', 3, 1),
('Angela', 'Martin', 4, 1),
('Kevin', 'Malone', 5, 1),
('Meredith', 'Palmer', 6, 1),
('Darryl', 'Philbin', 7, 1);
