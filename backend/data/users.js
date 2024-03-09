// users.js
const bcrypt = require("bcrypt");

const password = "123";
const saltRounds = 10;

const createPasswordHash = async (password, saltRounds) => {
    return await bcrypt.hash(password, saltRounds);
};

// Export a function that resolves with the users array
const getUsers = async () => {
    const passwordHash = await createPasswordHash(password, saltRounds); // Wait for the hash to be created

    const users = [
        {
            name: "Admin User",
            email: "admin@email.com",
            passwordHash, // Use the resolved hash
            isAdmin: true,
        },
        {
            name: "John Doe",
            email: "john@email.com",
            passwordHash, // Use the resolved hash
        },
        {
            name: "Jane Doe",
            email: "jane@email.com",
            passwordHash, // Use the resolved hash
        },
    ];

    return users;
};

module.exports = getUsers;
