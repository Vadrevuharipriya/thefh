import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import PanelUser from './models/PanelUser.js';

// Default admin panel user credentials
const defaultAdmin = {
  contactName: 'Super Admin',
  mobilePhone: '+918926262674',
  emailAddress: 'admin@thefamoushalwai.com',
  username: 'admin',
  password: 'admin@123', // In production, this should be hashed - but the app stores plain text
  designation: 'System Administrator',
  status: 'Approved',
  role: 'Admin'
};

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const existing = await PanelUser.findOne({ username: defaultAdmin.username });
    if (existing) {
      console.log('Admin user already exists. Updating password...');
      await PanelUser.findOneAndUpdate(
        { username: defaultAdmin.username },
        { ...defaultAdmin },
        { new: true }
      );
      console.log('✓ Admin user updated');
    } else {
      await PanelUser.create(defaultAdmin);
      console.log('✓ Admin user created');
      console.log('\nDefault Admin Credentials:');
      console.log('  Username: admin');
      console.log('  Password: admin@123');
      console.log('  Email: admin@thefamoushalwai.com');
    }

    console.log('\nAll PanelUsers:');
    const all = await PanelUser.find({}, 'username role status contactName');
    all.forEach(u => console.log(`  ${u.username} (${u.role}) - ${u.status} - ${u.contactName}`));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
seed();
