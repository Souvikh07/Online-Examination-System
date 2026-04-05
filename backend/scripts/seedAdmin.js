require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const email = process.env.ADMIN_EMAIL || 'admin@exam.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrator';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }
  await User.create({ name, email, password, role: 'admin' });
  console.log('Admin created:', email);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
