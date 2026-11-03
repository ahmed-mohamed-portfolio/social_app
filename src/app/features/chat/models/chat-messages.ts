






export interface ChatMessages {
    message: string
    data: Data
}

export interface Data {
    chat: Chat
}

export interface Chat {
    _id: string
    participants: Participant[]
    type: string
    messages: Message[]
    createdBy: string
    createdAt: string
    updatedAt: string
    __v: number
    id: string
    pages: number
    totalMessages: number

}

export interface Participant {
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

export interface Message {
    content: string
    attachments?: any[]
    likes?: any[]
    tags?: any[]
    createdBy: string
    _id: string
    createdAt: string
    updatedAt?: string
    id?: string
}
