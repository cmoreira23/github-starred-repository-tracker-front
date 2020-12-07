import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GithubRepository } from '../model/github-repository';
@Injectable({
  providedIn: 'root'
})
export class GithubRepositoryService {

  constructor(private http: HttpClient) { }

  getGithubRepositories(language:string) :Observable<GithubRepository[]>{
  let  url = `http://localhost:8080/api/githubRepositories?language=${language}`;
    return this.http.get<GithubRepository[]>(url);
  }
  
  refresh(language:string) {
    let  url = `http://localhost:8080/api/refresh?language=${language}`;
      return this.http.get(url);
    }
}
