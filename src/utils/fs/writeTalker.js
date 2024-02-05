const fs = require('fs').promises;

const writeTalker = async (path, ob) => {
  await fs.writeFile(path, JSON.stringify(ob, null, 2));
};

module.exports = writeTalker;