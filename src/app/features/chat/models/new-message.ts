




export interface NewMessage {
    message: Message
    from: From
}

export interface Message {
    _id: string
    content: string
    createdBy: string
    createdAt: string
}

export interface From {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    profileCoverPic: any[]
    friends: Friend[]
    dateOfBirth: string
    gender: string
    role: number
    provider: number
    confirmEmail: boolean
    credentialsUpdatedAt: string
    slug: string
    createdAt: string
    updatedAt: string
    __v: number
    profilePic: string
    userName: string
    id: string
}

export interface Friend {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    profileCoverPic: any[]
    password: string
    friends: string[]
    dateOfBirth: string
    gender: string
    role: number
    provider: number
    confirmEmail: boolean
    credentialsUpdatedAt: string
    slug: string
    createdAt: string
    updatedAt: string
    __v: number
    profilePic: string
    userName: string
    id: string
}
