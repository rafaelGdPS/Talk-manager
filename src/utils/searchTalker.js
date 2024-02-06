const searchTalker = (data, q) => {
  const filterData = data.filter((d) => d.name.includes(q));
  return filterData;
};

module.exports = searchTalker;