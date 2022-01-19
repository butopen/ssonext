export interface SSONextLabels {
    "login.input.email.label": string;
    "login.input.password.placeholder": string;
    "login.link.register": string;
    "login.tab": string;
    "login.input.email.placeholder": string;
    "login.button.login": string;
    "login.input.password.label": string;
    "login.link.forgot": string
    "register.tab": string
}

export const defaultLabels = {
    "login.tab": "Login",
    "login.input.email.label": "E-mail",
    "login.input.email.placeholder": "Your e-mail",
    "login.input.password.label": "Password",
    "login.input.password.placeholder": "Insert your password",
    "login.link.forgot": "Forgot your password?",
    "login.link.register": "Don't have an account yet? Sign-up",
    "login.button.login": "Login",
    "register.tab": "Register",
}

declare global {
    interface Window {
        ssonext: {
            config?: {
                labels: Partial<SSONextLabels>
            }
        };
    }
}



