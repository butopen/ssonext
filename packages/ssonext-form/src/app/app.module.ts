import {Injector, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import {BoDesignSystemModule} from "@butopen/bo-design-system";
import { RegisterFormComponent } from './register-form/register-form.component';
import {FormsModule} from "@angular/forms";
import { LoginFormComponent } from './login-form/login-form.component';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';
import {HttpClientModule} from "@angular/common/http";
import  { createCustomElement } from '@angular/elements';

declare global {
  interface Window {
    ssonext: { version?: string, backend:string};
  }
}

window.ssonext = window.ssonext ||  {}
window.ssonext.backend = window.ssonext.backend || "http://localhost:3000/api"


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    RegisterFormComponent,
    LoginFormComponent,
    ForgotPasswordFormComponent,
    ResetPasswordFormComponent
  ],
  imports: [
    BrowserModule, BoDesignSystemModule, FormsModule, HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(injector:Injector) {
    const form = createCustomElement(FormComponent, { injector });
    customElements.define('ssonext-auth', form);
    const login = createCustomElement(LoginFormComponent, { injector });
    customElements.define('ssonext-login', login);
    const register = createCustomElement(RegisterFormComponent, { injector });
    customElements.define('ssonext-login', register);
  }


}
