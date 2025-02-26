import { Client } from 'pg';

const client = new Client({
  host: '127.0.0.1',
  port: 54322,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Successfully connected to PostgreSQL');
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } finally {
    await client.end();
  }
}

testConnection(); 