import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HTTP_STATUS } from '../config/constants.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide name, email and password' });
    if (!validateEmail(email))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide a valid email' });
    if (!validatePassword(password))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Password must be at least 6 characters' });
    if (password !== confirmPassword)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Passwords do not match' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Email is already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) { next(error); }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, company: user.company, role: user.role },
    });
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, company },
      { new: true, runValidators: true }
    );
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, company: user.company, role: user.role },
    });
  } catch (error) { next(error); }
};

// ── Agent Management (Admin only) ─────────────────────────────────────────

export const createAgent = async (req, res, next) => {
  try {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide name, email and password' });
    if (!validateEmail(email))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Please provide a valid email' });
    if (!validatePassword(password))
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Password must be at least 6 characters' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Email is already registered' });

    const agent = await User.create({ name, email, password, phone, company, role: 'AGENT' });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Agent created successfully',
      agent: {
        id: agent._id, name: agent.name, email: agent.email,
        phone: agent.phone, company: agent.company,
        role: agent.role, createdAt: agent.createdAt,
      },
    });
  } catch (error) { next(error); }
};

export const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'AGENT' }).select('-password').sort({ createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ success: true, count: agents.length, agents });
  } catch (error) { next(error); }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await User.findOneAndDelete({ _id: req.params.id, role: 'AGENT' });
    if (!agent)
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Agent not found' });
    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Agent deleted successfully' });
  } catch (error) { next(error); }
};