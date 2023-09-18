import express from 'express';
import asyncHandler from 'express-async-handler'
import EmployeesService from '../service/EmployeesService.mjs';

export const emploees = express.Router();
const employeesService = new EmployeesService();
//TODO validation schema based on Joi
emploees.delete('/:id', asyncHandler(
    async (req, res) => {
        const id = +req.params.id
        if (!await employeesService.deleteEmployee(id)) {
            res.status(404);
            throw `employee with id ${id} not found`;
        }
        res.send();
    }
))