import express from 'express';
import asyncHandler from 'express-async-handler'
import EmployeesService from '../service/EmployeesService.mjs';
import Joi from 'joi'
import config from 'config';
import { validate } from '../middleware/validation.mjs'
import authVerification from '../middleware/authVerification.mjs'
import valid from '../middleware/valid.mjs';

export const employees = express.Router();
const employeesService = new EmployeesService();

const schema = Joi.object({
    id: Joi.number().min(config.get('employee.minId')).max(config.get('employee.maxId')),
    birthDate: Joi.date().iso().greater(config.get('employee.minDate')).less(config.get('employee.maxDate')).required(),
    name: Joi.string().required(),
    department: Joi.string().valid(...config.get('employee.departments')).required(),
    salary: Joi.number().min(config.get('employee.minSalary')).max(config.get('employee.maxSalary')).required(),
    gender: Joi.string().valid('male', 'female').required()
})

employees.use(validate(schema))
employees.delete('/:id', authVerification("ADMIN"), asyncHandler(
    async (req, res) => {
        const id = +req.params.id
        if (!await employeesService.deleteEmployee(id)) {
            res.status(404);
            throw `employee with id ${id} not found`;
        }
        res.send();
    }
))

employees.post('', authVerification("ADMIN"), valid, asyncHandler(
    async (req, res) => {
        const employeeRes = await employeesService.addEmployee(req.body);
        if (!employeeRes && req.body.id) {
            res.status(400);
            throw `account ${req.body.username} already exists`
        }

        res.status(201).send(employeeRes);
    }
))

employees.get('/:id', authVerification("ADMIN", "USER"), asyncHandler(
    async (req, res) => {
        const id = +req.params.id
        const employee = await employeesService.getEmployee(id)
        if (!employee) {
            res.status(404);
            throw `employee with id ${id} not found`;
        }
        res.send(employee);
    }
))

employees.put('/:id', authVerification("ADMIN"), valid, asyncHandler(
    async (req, res) => {
        if (req.params.id != req.body.id) {
            res.status(400);
            throw `id in request parameter (${req.params.id}) doesn't match the id in employee object (req.body.id)`
        }
        const employee = await employeesService.updateEmployee(req.body); //TODO
        if (!employee) {
            res.status(404);
            throw `employee with id ${req.body.id} doesn't exist`
        }
        res.send(employee);
    }
))

employees.get('', authVerification("ADMIN", "USER"), asyncHandler(
    async (req, res) => {
        const employees = await employeesService.getAllEmployees();
        res.send(employees);
    }
))