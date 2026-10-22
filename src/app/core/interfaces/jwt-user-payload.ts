

export interface JwtUserPayload {
    id: string
    firstName: string
    lastName: string
    email: string
    iat: number
    exp: number
    aud: string
    iss: string
    jti: string
}
