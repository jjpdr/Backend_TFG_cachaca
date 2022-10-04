const validateProduct = (product) => {
  if (product.name && product.brand && product.price) return true;
  return false;
};

module.exports = validateProduct;
