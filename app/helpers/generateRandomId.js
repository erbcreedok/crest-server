const generatedIds = [];

function generateRandomId(length=4) {
  let id = (new Date().getTime() + '');
  id = id.slice(id.length - length, id.length);
  if (generatedIds.includes(id)) {
    id = generateRandomId(length);
  } else {
    generatedIds.push(id)
  }
  return id;
}

module.exports = generateRandomId;
