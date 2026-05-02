const fs = require('node:fs/promises');
const path = require('node:path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

require('dotenv').config();

async function ensureDatabaseExists({ host, user, password, database }) {
  const connection = await mysql.createConnection({
    host,
    user,
    password,
    multipleStatements: true
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );

  await connection.end();
}

async function tableExists(connection, database, tableName) {
  const [rows] = await connection.query(
    `
    SELECT 1 AS present
    FROM information_schema.tables
    WHERE table_schema = ? AND table_name = ?
    LIMIT 1
    `,
    [database, tableName]
  );

  return rows.length > 0;
}

async function ensureMigrationsTable(connection) {
  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
    `
  );
}

async function migrationAlreadyApplied(connection, filename) {
  const [rows] = await connection.query(
    'SELECT 1 FROM schema_migrations WHERE filename = ? LIMIT 1',
    [filename]
  );
  return rows.length > 0;
}

function decodeSqlBuffer(buffer) {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return buffer.toString('utf16le');
  }

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    return buffer.toString('utf8');
  }

  return buffer.toString('utf8');
}

function uniquifyGeneratedCheckConstraints(sql) {
  if (!sql.includes('CONSTRAINT `CONSTRAINT_')) {
    return sql;
  }

  const createTableRegex = /CREATE TABLE `([^`]+)` \([\s\S]*?\)\s*ENGINE=[^;]+;/g;

  return sql.replace(createTableRegex, (statement, tableName) => {
    return statement.replace(
      /CONSTRAINT `CONSTRAINT_(\d+)` CHECK/gi,
      `CONSTRAINT \`${tableName}_chk_$1\` CHECK`
    );
  });
}

async function applySqlFile(connection, filePath) {
  const buffer = await fs.readFile(filePath);
  let sql = decodeSqlBuffer(buffer);

  // Defensive cleanup for BOM/encoding artifacts that can break MySQL parsing.
  sql = sql.replace(/^\uFEFF/, '');
  sql = sql.replace(/\u0000/g, '');
  sql = uniquifyGeneratedCheckConstraints(sql);

  if (!sql.trim()) {
    return;
  }

  await connection.query(sql);
}

async function applyMigrations(connection, migrationsDir) {
  let files = [];
  try {
    files = await fs.readdir(migrationsDir);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  const sqlFiles = files.filter((file) => file.endsWith('.sql')).sort();

  for (const filename of sqlFiles) {
    if (await migrationAlreadyApplied(connection, filename)) {
      continue;
    }

    const filePath = path.join(migrationsDir, filename);
    await applySqlFile(connection, filePath);
    await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [filename]);
  }
}

async function seedAdminUser(connection) {
  const email = (process.env.SEED_ADMIN_EMAIL || '').trim();
  const password = process.env.SEED_ADMIN_PASSWORD || '';
  const fullName = (process.env.SEED_ADMIN_FULL_NAME || 'Administrator').trim() || 'Administrator';

  if (!email || !password) {
    return { seeded: false, reason: 'missing_credentials' };
  }

  const [existingRows] = await connection.query(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  if (existingRows.length) {
    return { seeded: false, reason: 'already_exists' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await connection.query(
    `
    INSERT INTO users (full_name, email, password_hash, role, is_active)
    VALUES (?, ?, ?, 'admin', 1)
    `,
    [fullName, email, passwordHash]
  );

  return { seeded: true };
}

async function seedSampleRooms(connection) {
  const shouldSeed = String(process.env.SEED_SAMPLE_DATA || '').toLowerCase();
  if (!['1', 'true', 'yes', 'y'].includes(shouldSeed)) {
    return { seeded: false, reason: 'disabled' };
  }

  const [typeRows] = await connection.query('SELECT COUNT(*) AS count FROM room_types');
  const [roomRows] = await connection.query('SELECT COUNT(*) AS count FROM rooms');

  const hasTypes = Number(typeRows?.[0]?.count || 0) > 0;
  const hasRooms = Number(roomRows?.[0]?.count || 0) > 0;

  if (hasTypes || hasRooms) {
    return { seeded: false, reason: 'already_has_data' };
  }

  const [standardType] = await connection.query(
    `
    INSERT INTO room_types (name, description, base_capacity, max_capacity, base_price, extra_guest_fee)
    VALUES ('Standard Room', 'Simple room option with essential amenities.', 2, 3, 2500.00, 500.00)
    `
  );

  const [deluxeType] = await connection.query(
    `
    INSERT INTO room_types (name, description, base_capacity, max_capacity, base_price, extra_guest_fee)
    VALUES ('Deluxe Room', 'Upgraded room with additional space and view.', 2, 4, 3500.00, 500.00)
    `
  );

  const standardTypeId = standardType.insertId;
  const deluxeTypeId = deluxeType.insertId;

  await connection.query(
    `
    INSERT INTO rooms (room_type_id, room_number, room_name, description, floor_label, status, is_featured, is_active)
    VALUES
      (?, '101', 'Standard 101', 'Cozy standard room near the garden.', 'Ground Floor', 'available', 0, 1),
      (?, '102', 'Standard 102', 'Cozy standard room near the pool.', 'Ground Floor', 'available', 0, 1),
      (?, '201', 'Deluxe 201', 'Deluxe room with balcony view.', 'Second Floor', 'available', 1, 1)
    `,
    [standardTypeId, standardTypeId, deluxeTypeId]
  );

  return { seeded: true };
}

async function main() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    throw new Error('Missing DB_HOST, DB_USER, or DB_NAME in backend/.env');
  }

  await ensureDatabaseExists({ host, user, password, database });

  const connection = await mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
  });

  try {
    await ensureMigrationsTable(connection);

    const hasUsers = await tableExists(connection, database, 'users');
    const forceSchema = String(process.env.FORCE_SCHEMA || '').toLowerCase();
    const shouldForceSchema = ['1', 'true', 'yes', 'y'].includes(forceSchema);

    if (!hasUsers || shouldForceSchema) {
      const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');
      await applySqlFile(connection, schemaPath);
    }

    const migrationsDir = path.resolve(__dirname, '..', 'database', 'migrations');
    await applyMigrations(connection, migrationsDir);

    const adminSeed = await seedAdminUser(connection);
    const sampleSeed = await seedSampleRooms(connection);

    console.log('Database ready:', database);
    console.log('Admin seed:', adminSeed);
    console.log('Sample rooms seed:', sampleSeed);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
