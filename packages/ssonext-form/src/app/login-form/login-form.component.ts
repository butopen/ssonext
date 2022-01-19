import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SsonextApiService} from "../ssonext-api.service";

@Component({
  selector: 'sn-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LoginFormComponent implements OnInit {


  showForgotPasswordPopup = false;
  loading = false;


  constructor(private ssonextApiService:SsonextApiService) { }

  ngOnInit(): void {
  }

  async login(loginForm: any) {
    const email = loginForm.form.controls.email.value
    const password = loginForm.form.controls.password.value
    await this.ssonextApiService.login({email, password})
    return false;
  }
}
