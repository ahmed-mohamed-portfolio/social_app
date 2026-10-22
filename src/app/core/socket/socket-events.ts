


export const SocketEvents = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    GET_USERS_IN_CHAT: 'getUsersInChat', //used it to EMIT to get all chat users
    USERS_IN_CHAT: 'usersInChat', // used it to ON to get all chat users

    SEND_MESSAGE: 'sendMessage',
    NEW_MESSAGE: 'newMessage',
    SUCCESS_MESSAGE: 'successMessage',

    CUSTOM_ERROR: 'custom_error'
} as const;