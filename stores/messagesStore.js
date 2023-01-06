module.exports = class MessagesStore {
    constructor() {
        this.messages = {}
    }

    // message - userId, content, date, toUserId
    addMessage(userId, message) {
        if (!this.messages[userId]) {
            this.messages[userId] = []
        }
        const encryptedMessage = jwt.sign(content, 'secret-key')
        message.content = encryptedMessage
        this.messages[userId].push(message)
    }

    getUserMessages(userId) {
        return this.messages[userId] || []
    }
}