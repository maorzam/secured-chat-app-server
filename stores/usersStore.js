const jwt = require('jsonwebtoken');
const { v4 : uuidv4 } = require('uuid');

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

    addUser({ socketId, username, password, email }) {
        console.log('add user method')
        const userId = uuidv4()
        const hashedPassword = jwt.sign(password, 'secret-key');
        console.log({hashedPassword})
        this.users.push({
            userId,
            username,
            email,
            password: hashedPassword,
            socketId,
            online: true,
            messages: []
        })
        return userId
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