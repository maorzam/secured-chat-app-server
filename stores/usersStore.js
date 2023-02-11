const jwt = require('jsonwebtoken');

module.exports = class UsersStore {
    constructor() {
        this.users = []
    }

    getUsers() {
        return this.users;
    }

    addUser({ socketId, username, password, room }) {
        const hashedPassword = jwt.sign(password, 'secret-key');
        this.users.push({
            userId: socketId,
            username,
            room,
            password: hashedPassword,
            socketId,
            online: true,
            messages: []
        })
    }

    findUserBySocketId(socketId) {
        return this.users.find(user => user.socketId === socketId)
    }

    removeUser(socketId) {
        const user = this.findUserBySocketId(socketId)
        this.users = this.users.filter(user => user.socketId === socketId)
        return user
    }
}