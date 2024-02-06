module.exports = (req, res, next) => {
  const { rate } = req.body.talk;
  const validate = rate > 0 && rate <= 5;
  if (rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) || !validate) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
    );
  }
  next();
};