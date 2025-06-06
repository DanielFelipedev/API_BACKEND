const userService = require('../services/userService');

// Cadastro agora não recebe mais "speed"
const cadastro = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  try {
    // Define o speed como null ou 0 inicialmente no service
    const id = await userService.cadastroUser(email, password);
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', id });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    if (error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }
  try {
    const user = await userService.loginUser(email, password);
    if (user) {
      const { password: _, ...userData } = user;
      res.json({ message: 'Login bem-sucedido', user: userData });
    } else {
      res.status(401).json({ message: 'Email ou senha incorretos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// Atualiza velocidade quando o app conectar via Bluetooth e o usuário apertar "Run"
const updateSpeed = async (req, res) => {
  const { id } = req.params;
  const { speed } = req.body;
  if (speed === undefined) {
    return res.status(400).json({ message: 'Velocidade é obrigatória' });
  }
  try {
    const user = await userService.updateSpeed(id, speed);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ message: 'Velocidade atualizada', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar velocidade' });
  }
};

module.exports = {
  cadastro,
  login,
  getUser,
  updateSpeed,
};
