import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ResearchesService {
  apiUrl = environment.apiUrl;
  link = "researches";

  constructor(private http: HttpClient) {}

  getAllResearches(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${this.link}`);
  }
}
