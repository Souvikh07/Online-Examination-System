const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('FATAL: MONGO_URI is not set. Add it in Render → Environment.');
    process.exit(1);
  }

  if (uri.includes('<db_password>') || uri.includes('YOUR_PASSWORD')) {
    console.error('FATAL: MONGO_URI still contains a placeholder password. Use your real Atlas password.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);

    const msg = err.message.toLowerCase();
    if (msg.includes('authentication failed') || msg.includes('bad auth')) {
      console.error('Hint: Wrong username/password. URL-encode special characters in the password.');
    } else if (msg.includes('ip') || msg.includes('whitelist')) {
      console.error('Hint: In Atlas → Network Access, allow 0.0.0.0/0 (required for Render).');
    } else if (msg.includes('econnrefused') || msg.includes('querysrv') || msg.includes('enotfound')) {
      console.error('Hint: Cluster may be paused, deleted, or DNS blocked. In Atlas → Database, resume the cluster.');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
