const dbConnection = require("./mongoConnection");

/* Reference to a given collection */
const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Collections */
module.exports = {
  users: getCollectionFn("users")
};
