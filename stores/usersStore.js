const jwt = require('jsonwebtoken');

module.exports = class UsersStore {
    constructor() {
        this.users = []
    }

    getUsers() {
        return this.users;
    }

    isUsernameTaken(username) {
        const existUsername = this.users.filter(user => user.username === username)
        console.log({existUsername})
        return existUsername.length > 0
    }

    addUser({ socketId, username, password }) {
        console.log('add user method')
        const hashedPassword = jwt.sign(password, 'secret-key');
        console.log({hashedPassword})
        this.users.push({
            userId: socketId,
            username,
            password: hashedPassword,
            socketId,
            online: true,
            messages: []
        })
    }

    findUserBySocketId(socketId) {
        return this.users.find(user => user.socketId === socketId)
    }

    setUserOnline(userId) {
        const user = this.users.find(user => user.userId === userId);
        if (user) {
            user.online = true
        }
    }
}