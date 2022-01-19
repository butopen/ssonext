

export interface SNLoginUser {
    email: string
    password: string
}

type UserPredefinedRole = "UNCONFIRMED_EMAIL" | "EMAIL_CONFIRMED" | "ADMIN" | "USER"

export interface SNUser {
    userid: number
    email: string
    password: string
    roles: (UserPredefinedRole | string)[]
    created: Date
    tenant: string
    info: unknown
}

export type SNUserWithoutId = Omit<SNUser, "userid">
export type SNUserWithoutPassword = Omit<SNUser, "password">
