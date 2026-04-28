import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import { USER_ROLES } from './config/constants.js';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ewarranty.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '0000000000';

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      if (existingAdmin.role !== USER_ROLES.ADMIN) {
        existingAdmin.role = USER_ROLES.ADMIN;
        await existingAdmin.save();
        console.log(`Updated existing user to admin: ${ADMIN_EMAIL}`);
      } else {
        console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      }
      process.exit(0);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: ADMIN_PHONE,
      role: USER_ROLES.ADMIN,
    });

    console.log(`Admin user seeded successfully: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error(`Failed to seed admin user: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
