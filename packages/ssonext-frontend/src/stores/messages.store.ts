import { loggable, mergeable, Mergeable } from '../shared/store.util';

export interface SSOMessages {
  authForm: {
    tabs: {
      login: string;
      register: string;
    };
    login: {
      noAccountLabel: string;
      noAccountLink: string;
    };
    register: {
      alreadyHaveAccountLabel: string;
      alreadyHaveAccountLink: string;
    };
  };
}

export const messagesStore = loggable(
  mergeable<SSOMessages>({
    authForm: {
      tabs: {
        login: 'Login',
        register: 'Sign up'
      },
      login: {
        noAccountLabel: `Don't have an account yet?`,
        noAccountLink: 'Sign up now'
      },
      register: {
        alreadyHaveAccountLabel: 'Already have an account?',
        alreadyHaveAccountLink: 'Login now'
      }
    }
  })
);
