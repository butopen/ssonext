import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SsonextApiService} from "../ssonext-api.service";

@Component({
  selector: 'sn-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RegisterFormComponent implements OnInit {


  emailExists = false;
  loading = false;

  constructor(private ssonextApiService: SsonextApiService) {
  }

  ngOnInit(): void {
  }

  async register(registerForm: NgForm) {
    const formData: { [key: string]: string } = {}
    for (let controlName in registerForm.form.controls) {
      formData[controlName] = registerForm.form.controls[controlName].value
    }
    await this.ssonextApiService.register(formData)
    return false;
  }

  async checkEmail(email:string) {
    this.emailExists = (await this.ssonextApiService.checkEmail(email))!.exists
  }
}
