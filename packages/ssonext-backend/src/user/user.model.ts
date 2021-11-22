

export interface SNLoginUser {
    email: string
    password: string
}

export interface SNUser {
    userid: number
    email: string
    password: string
    roles: string[]
    created: Date
    tenant: string
    info: unknown
}

export type SNUserWithoutId = Omit<SNUser, "userid">
export type SNUserWithoutPassword = Omit<SNUser, "password">
