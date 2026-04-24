import express from 'express'

import { createEmployee, createEmployer, loginEmployee, loginEmployer, logoutEmployee, logoutEmployer, getEmployees, getEmployee, updateEmployee, deleteEmployee, getEmployeeDetails } from '../controllers/tasks.js'
import { authMiddleware, authMiddleware2 } from '../middleware/auth.js'

export const router2 = express.Router()
export const router = express.Router()

router2.route('/register-employee').post(authMiddleware2, createEmployee)
router2.route('/register-employer').post(createEmployer)
router2.route('/login-employee').post(loginEmployee)
router2.route('/login-employer').post(loginEmployer)
router2.route('/logout-employee').post(authMiddleware, logoutEmployee)
router2.route('/logout-employer').post(authMiddleware2, logoutEmployer)

router.route('/employee/me').get(authMiddleware, getEmployeeDetails)
router.route('/').get(authMiddleware2, getEmployees)
router.route('/:id').all(authMiddleware2).delete(deleteEmployee).get(getEmployee).put(updateEmployee)