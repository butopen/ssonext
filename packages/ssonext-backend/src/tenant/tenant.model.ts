export interface TenantConfiguration {
    informationFieldsInToken: '*' | string
    serviceName: string
    domain: string
    code: string
    labels?: {
        "login.tab": string
        "login.input.email.label": string
        "login.input.email.placeholder": string
        "login.input.password.label": string
        "login.input.password.placeholder": string
        "login.link.forgot": string
        "login.link.register": string
        "login.button.login": string
    }
}

export function defaultTenantConfig(): TenantConfiguration {
    return {
        informationFieldsInToken: '*',
        serviceName: "",
        domain: "",
        code: ""
    }
}
