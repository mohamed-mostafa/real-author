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

  constructor(private _httpClient: HttpClient) {}

  getAllResearches(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiUrl}/${this.link}`);
  }
  deleteResearches(usherId) {
    return this._httpClient.delete(`${this.apiUrl}/${this.link}/${usherId}`, {
      observe: "response",
    });
  }

  sendResearchesData(body: any) {
    return this._httpClient.post(`${this.apiUrl}/${this.link}`, body, {
      observe: "response",
    });
  }

  UpdateResearchesData(body: any, researchId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}`,
      body,
      {
        observe: "response",
      }
    );
  }

  getSingleResearch(researchId) {
    return this._httpClient.get(`${this.apiUrl}/${this.link}/${researchId}`, {
      observe: "response",
    });
  }

  getSingleResearchInvestigators(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/investigators`,
      {
        observe: "response",
      }
    );
  }

  getSingleResearchRank(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/rank`,
      {
        observe: "response",
      }
    );
  }

  getSingleResearchCommonParameters(researchId: string) {
    return this._httpClient.get(
      `${this.apiUrl}/${this.link}/${researchId}/parameters`,
      {
        observe: "response",
      }
    );
  }

  updateParameters(researchId: string, data: object) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/parameters`,
      { commonParameters: { ...data } },
      {
        observe: "response",
      }
    );
  }

  calcRank(researchId: string, userId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/rank`,
      { userId: userId },
      {
        observe: "response",
      }
    );
  }

  participate(researchId: string, data: object) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/participate`,
      data,
      {
        observe: "response",
      }
    );
  }

  deleteInvestigator(researchId: string, investigatorId: string) {
    return this._httpClient.put(
      `${this.apiUrl}/${this.link}/${researchId}/investigators`,
      { investigatorId: investigatorId },
      {
        observe: "response",
      }
    );
  }
}
