const users = [
  { id: 1, name: "Abrar" },
  { id: 2, name: "Mayaz" },
];

const getUsers = (req, res) => {
  res.json(users);
};

const createUser = (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.json({
    message: "USer added",
    users: users,
  });
};

const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.name = req.body.name;
  res.json({
    message: "User updated",
    user,
  });
};

const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users.splice(userIndex, 1);
  res.json({ message: "User deleted", users });
};

module.exports = { getUsers, createUser, getUserById, updateUser, deleteUser};
