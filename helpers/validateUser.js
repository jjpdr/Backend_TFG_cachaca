const validateUser = (user) => {
    if (user.name && user.email && user.cpf && user.birthday && user.password)
        return true;
    return false;
};

module.exports = validateUser;
