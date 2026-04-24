import { EmployeeModel, EmployerModel } from '../models/tasks.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Blacklist from '../models/Blacklist.js'

export const createEmployee = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: "Password is required" })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const new_user = await EmployeeModel.create({
      ...req.body,
      password: hashedPassword
    })
    req.user.employerId
    const employer = await EmployerModel.findOneAndUpdate({_id: req.user.employerId}, { $addToSet: {employees: new_user._id} }, {returnDocument: 'after'})
    if (!employer) return res.status(404).json({ message: "Employer not found" })
    res.status(201).json({new_user, message: "Account Created!"})
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ errors: messages })
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      return res.status(400).json({
        message: `${field} already exists`
      })
    }
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const createEmployer = async (req, res) => {
    try {
      const { password } = req.body
      if (!password) return res.status(400).json({ message: "Password is required" })
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const new_user = await EmployerModel.create({
          ...req.body,
          password: hashedPassword
      })
      res.status(201).json({new_user, message: "Registration Successful!!!"})
    } catch (error) {
      if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(err => err.message)
          return res.status(400).json({ errors: messages })
      }
      if (error.code === 11000) {
          const field = Object.keys(error.keyValue)[0]
          return res.status(400).json({
              message: `${field} already exists`
          })
      }
      res.status(500).json({ message: "Something went wrong" })
    }
}

export const loginEmployee = async (req, res) => {
  const { email, password2 } = req.body
  if (!email || !password2) return res.status(400).json({ message: "All fields required" })
  const employee = await EmployeeModel.findOne({ email });
  if (!employee) return res.status(404).json({ message: "Employee not found" })
  const isMatch = await bcrypt.compare(password2, employee.password)
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
  }
  const token = jwt.sign(
    { employeeId: employee._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });
  return res.status(200).json({ message: "Login successful" })
};

export const loginEmployer = async (req, res) => {
  const { email, password2 } = req.body
  if (!email || !password2) return res.status(400).json({mesage: "All fields required"})
  const employer = await EmployerModel.findOne({email})
  if (!employer) return res.status(404).json({ message: "Employer not found" })
  const isMatch = await bcrypt.compare(password2, employer?.password)
  if (!isMatch) {
      return res.json({message: "wrong password"})
  }
  const token = jwt.sign(
    { employerId: employer._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });
  return res.status(200).json({ message: "Login successful" })
}

export const logoutEmployee = async (req, res) => {
  try {
    const token = req.cookies.token
    if (token) {
      await Blacklist.create({ token })
    }
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" })
  }
}

export const logoutEmployer = async (req, res) => {
  try {
    const token = req.cookies.token
    if (token) await Blacklist.create({ token })
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" })
  }
}

export const getEmployees = async(req, res) => {
  const employer = await EmployerModel.findById({_id: req.user.employerId}).populate("employees");
  res.json(employer.employees);
}

export const getEmployee = async(req, res) => {
  const employee = await EmployeeModel.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
}

export const getEmployeeDetails = async(req, res) => {
  const employee = await EmployeeModel.findById(req.user.employeeId);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee)
}

export const updateEmployee = async(req, res) => {
  const update = await EmployeeModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after' }
  );
  if (!update) return res.status(404).json({ message: "Worker not found" });
  res.json(update);
}

export const deleteEmployee = async(req, res) => {
  const info = await EmployeeModel.deleteOne({ _id: req.params.id });
  if (info.deletedCount === 1)return res.json({ message: "Worker deleted" });
  res.status(404).json({ message: "Worker not found" });
}