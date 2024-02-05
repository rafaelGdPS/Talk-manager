const express = require('express');
const readTalkers = require('./utils/fs/readTalker');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./utils/validateEmail');
const validatePassword = require('./utils/validatePassword');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';
const PATH = 'src/talker.json';

app.listen(PORT, () => {
  console.log('Online');
});
// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const data = await readTalkers(PATH);
  return res.status(200).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readTalkers(PATH);
  const result = data.find((t) => t.id === Number(id));
  if (!result) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(result);
});

app.post('/login', validateEmail, validatePassword, async (req, res) => {
  // const data = await readTalkers(PATH);
  // const { body } = req;
  const token = generateToken();
  return res.status(200).json({ token });
});
