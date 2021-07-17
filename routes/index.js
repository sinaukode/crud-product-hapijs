
const product = require('./productRoutes');
const adjTrx = require('./adjustmentTrxRoutes');

module.exports = [].concat(product,adjTrx);
