import { Doc } from "../../../../core/interfaces/posts"


export interface DeletePostRes {
    message: string
    data: post
}

export interface post extends Doc {

}
