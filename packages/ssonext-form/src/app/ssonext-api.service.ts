import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SsonextApiService {
  private basePath: string;

  constructor(private http: HttpClient) {
    this.basePath = window.ssonext.backend
  }

  register(formData: { [key: string]: string }) {
    this.http.post(this.basePath + "/user/request-registration", formData).toPromise()
  }

  login(loginData: { email: string, password: string }) {
    this.http.post(this.basePath + "/user/login", loginData).toPromise()
  }


  async checkEmail(email: string) {
    return this.http.get<{exists:boolean}>(this.basePath + "/user/email-exists?email=" + email).toPromise()
  }
}
