

export interface UserInfo {
  message: string
  data: IUser
}

export interface User {
  _id: string
  name: string
  email: string
  dateOfBirth: string
  gender: string
  photo: string
  createdAt: string
}



export interface IUser {

  _id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePic?: string
  profileCoverPic?: string[]
  password: string
  gender?: GenderEnum
  role?: RoleEnum
  provider?: ProviderEnum
  confirmEmail: boolean
  createdAt?: Date
  updatedAt?: Date
  dateOfBirth: Date
  credentialsUpdatedAt: Date
}


export enum GenderEnum {
  male = "male",
  female = "female"
}

export const enum RoleEnum {
  admin,
  user
}

export const enum ProviderEnum {
  system,
  google
}
