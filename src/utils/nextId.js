const readTalkers = require('./fs/readTalker');

const nextId = async (path) => {
  const data = await readTalkers(path);
  const findId = data.reduce((acc, cur) => {
    if (cur.id > acc) return cur.id;
    return acc; 
  }, 0);
  return findId + 1;
};

module.exports = nextId;