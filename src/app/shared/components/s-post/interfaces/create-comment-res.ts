import { Comments } from "../../../../core/interfaces/posts"


export interface CreateCommentRes {
    message: string
    data: Data
}

export interface Data extends Comments {

}
