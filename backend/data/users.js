const bcrypt = require("bcrypt");

const password = "123";
const saltRounds = 10;

const createPasswordHash = async (password, saltRounds) => {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
};

const passwordHash = String(createPasswordHash(password, saltRounds));

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        passwordHash: passwordHash,
        isAdmin: true,
    },
    {
        name: "John Doe",
        email: "john@email.com",
        passwordHash: passwordHash,
    },
    {
        name: "Jane Doe",
        email: "jane@email.com",
        passwordHash: passwordHash,
    },
];

module.exports = users;
