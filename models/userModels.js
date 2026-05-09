const User = require("../schema/User");

const findAll = async () => {
  return await User.findAll({
    attributes: ["id", "username", "email"],
  });
};

const create = async (userData) => {
  return await User.create(userData);
}

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "username", "email"],
  });
}

const updateById = async (id, userData) => {
  return await User.update(userData, {
    where: {
      id: id,
    },
  });
}

const deleteById = async (id) => {
  return await User.destroy({
    where: {
      id: id,
    },
  });
}

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};
