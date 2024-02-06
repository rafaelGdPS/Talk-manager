const fs = require('fs').promises;

const readTalkers = async (path) => {
  const readfiles = await fs.readFile(path, 'utf8');
  return JSON.parse(readfiles);
};

module.exports = readTalkers;