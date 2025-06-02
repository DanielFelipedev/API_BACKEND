const db = require('../models/db');
const bcrypt = require('bcrypt');

const cadastroUser = async (email, password, speed) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT, 10) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await db.query(
    'INSERT INTO usuarios (email, password, speed) VALUES ($1, $2, $3) RETURNING id',
    [email, hashedPassword, speed]
  );
  return result.rows[0].id;
};

const loginUser = async (email, password) => {
  const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return user;
};

const getUserById = async (id) => {
  const result = await db.query('SELECT id, email, speed FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
};

const updateSpeed = async (id, speed) => {
  await db.query('UPDATE usuarios SET speed = $1 WHERE id = $2', [speed, id]);
  return await getUserById(id);
};

module.exports = {
  cadastroUser,
  loginUser,
  getUserById,
  updateSpeed,
};
