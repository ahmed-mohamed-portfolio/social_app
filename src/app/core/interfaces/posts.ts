



export interface postsReturn {
  message: string
  data: allPostsReturn
}


export interface allPostsReturn {
  docs: Doc[]
  currentPage: number
  size: number
  pages: number
}

export interface Doc {
  _id: string
  folderId: string
  content: string
  attachments: string[]
  availability: number
  likes: string[]
  tags: string[]
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
  updatedBy?: string
  comments?: Comments[]
  id: string
}

export interface Comments {
  _id: string
  content: string
  attachments: string[]
  postId: string
  likes: any[]
  tags: any[]
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
  reply: Reply[]
  id: string
}

export interface Reply {
  _id: string
  content: string
  attachments: any[]
  postId: string
  commentId: string
  likes: any[]
  tags: any[]
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
  reply: Reply2[]
  id: string
}

export interface Reply2 {
  _id: string
  content: string
  attachments: any[]
  postId: string
  commentId: string
  likes: any[]
  tags: any[]
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}





export interface CreatedBy {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileCoverPic: any[]
  password: string
  friends: any[]
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


//===================


export interface singlePost {
  message: string
  data: Data
}

export interface Data {
  _id: string
  folderId: string
  content: string
  attachments: string[]
  availability: number
  likes: string[]
  tags: string[]
  createdBy: CreatedBy
  createdAt: string
  updatedAt: string
  __v: number
  updatedBy?: string
  comments?: Comments[]
  id: string
}


//========================================

export interface userPosts {
  message: string
  data: post[]
}

export interface post extends Doc {



}


//========================================


// export interface deletePostRes {
//   message: string
//   data: Data
// }

// export interface Data {
//   _id: string ,
//   folderId: string ,
//   content: string ,
//   attachments: any[] ,
//   availability: number ,
//   likes: any[]
//   tags: string[]
//   createdBy: string
//   createdAt: string
//   updatedAt: string
//   __v: number
//   deletedAt: string
//   updatedBy: string
//   id: string
// }

