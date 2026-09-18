

export interface EditCommentRes {
    message: string
    data: Data
}

export interface Data {
    _id: string
    content: string
    attachments: any[]
    postId: string
    likes: any[]
    tags: any[]
    createdBy: string
    createdAt: string
    updatedAt: string
    __v: number
    updatedBy: string
    id: string
}
