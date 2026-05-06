const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.bxmxatjsckzemgrlvbbt',
  password: 'Ahmad00786@5581',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error', err.stack);
  }
}

testConnection();
