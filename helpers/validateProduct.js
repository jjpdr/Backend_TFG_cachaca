const validateProduct = (product) => {
    if (product.nome && product.marca_produto && product.preco) return true;
    return false;
};

module.exports = validateProduct;
