function flipPlainObject(plainObject) {
  const result = {};
  Object.keys(plainObject).forEach((key) => {
    result[plainObject[key]] = key;
  });
  return result;
}
module.exports = flipPlainObject;
