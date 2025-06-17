import axios from 'axios';
import { Request, Response } from 'express';
import User from '../models/User';

const MUDRA_AUTH_API = process.env.MUDRA_AUTH_API;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Register with Mudra Auth API
    const mudraRes = await axios.post(`${MUDRA_AUTH_API}/register`, { email, password });
    const { userId } = mudraRes.data;
    // Create user in local DB
    let user = await User.findOne({ mudraId: userId });
    if (!user) {
      user = await User.create({ mudraId: userId, email });
    }
    res.status(201).json({ message: 'Registered', user });
  } catch (error: any) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Login with Mudra Auth API
    const mudraRes = await axios.post(`${MUDRA_AUTH_API}/login`, { email, password });
    const { userId, accessToken, refreshToken } = mudraRes.data;
    // Find user in local DB
    let user = await User.findOne({ mudraId: userId });
    if (!user) {
      user = await User.create({ mudraId: userId, email });
    }
    res.json({ accessToken, refreshToken, user });
  } catch (error: any) {
    res.status(401).json({ error: error.response?.data || error.message });
  }
}; 