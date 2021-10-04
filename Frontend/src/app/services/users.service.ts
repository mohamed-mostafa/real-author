import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  apiUrl = environment.apiUrl;
  link = "users";

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${this.link}`);
  }
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/local/register`, user);
  }
}
