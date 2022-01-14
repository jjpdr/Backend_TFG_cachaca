const validateMarca = (product) => {
    if (product.nome && product.marca_produto && product.preco) return true;
    return false;
};

module.exports = validateMarca;
