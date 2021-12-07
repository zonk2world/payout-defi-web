const db = require('../config/cache');

// @todo Redis or SQLite for caching
// SQLite is super faster than Redis for single server, but not suitable for cluster
// @reference https://github.com/box/ClusterRunner/issues/401

/**
 * Get Item
 */
const getBlockHeader = () => {
  try {
    const stmt = db.prepare("SELECT blockHeader FROM cache");
    const result = stmt.get();
    return result ? parseInt(result.blockHeader, 10) : 0;
  } catch (err) {
    console.error(err.message);
    return 0;
  }
};

/**
 * Set Item
 */
const setBlockHeader = (blockHeader) => {
  try {
    const stmt = db.prepare("UPDATE cache SET blockHeader = ?");
    stmt.run(blockHeader);
    return true;
  } catch (err) {
    console.error(err.message);
    return false
  }
};


module.exports = {
  getBlockHeader,
  setBlockHeader
};