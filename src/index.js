const express = require('express');
const readTalkers = require('./utils/fs/readTalker');
const generateToken = require('./utils/generateToken');
const validateEmail = require('./utils/validateEmail');
const validatePassword = require('./utils/validatePassword');
const writeTalker = require('./utils/fs/writeTalker');
const validateToken = require('./utils/validateToken');
const validateName = require('./utils/validateName');
const validateAge = require('./utils/validateAge');
const validateTalk = require('./utils/validateTalk');
const validateWatched = require('./utils/validateWatched');
const validateRate = require('./utils/validateRate');
const validateId = require('./utils/validateId');
const searchTalker = require('./utils/searchTalker');

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
app.get('/talker/search', validateToken, async (req, res) => {
  const searchParams = req.query.q;
  const data = await readTalkers(PATH);
  const tlks = searchTalker(data, searchParams);
  if (!searchParams || searchParams === '') {
    return res.status(200).json(data);
  }
  if (tlks.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(tlks);
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

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post('/talker', 
  validateToken, 
  validateName, 
  validateAge, 
  validateTalk, 
  validateWatched, 
  validateRate, async (req, res) => {
    const data = await readTalkers(PATH);
    const { body } = req;
    const newObject = { id: data.length + 1, ...body };
    const newTalker = [...data, newObject];
    await writeTalker(PATH, newTalker);
    return res.status(201).json(newObject);
  });

app.put('/talker/:id',
  validateToken, 
  validateName, 
  validateAge, 
  validateTalk, 
  validateWatched, 
  validateRate,
  validateId, async (req, res) => {
    const { id } = req.params;
    const data = await readTalkers(PATH);
    const { body } = req;
    const updateTalk = data.map((talk) => {
      if (talk.id === Number(id)) return { id: Number(id), ...body };
     
      return talk;
    }); 
    if (data.every((talk) => talk.id !== Number(id))) {
      return res.status(404).json(
        { message: 'Pessoa palestrante não encontrada' },
      );
    }
    
    await writeTalker(PATH, updateTalk);
    res.status(200).json({ id: Number(id), ...body });
  });

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const data = await readTalkers(PATH);
  const deleteTalker = data.filter((talk) => talk.id !== Number(id));
  await writeTalker(PATH, deleteTalker);

  return res.status(204).json();
});
