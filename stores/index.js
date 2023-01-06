const MessagesStore = require('./messagesStore')
const UsersStore = require('./usersStore')
const messagesStore = new MessagesStore();
const usersStore = new UsersStore()
module.exports = { messagesStore, usersStore }