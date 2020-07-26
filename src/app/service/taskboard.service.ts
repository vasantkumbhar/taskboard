import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITask, IList } from 'src/model';

@Injectable({
  providedIn: 'root'
})
export class TaskboardService {
  private baseUrl = 'http://localhost:3000/';
  constructor(private httpClient: HttpClient) { }

  public get(url: string) {
    return this.httpClient.get(`${this.baseUrl}${url}`);
  }

  public add(value: ITask|IList, url: string){
    return this.httpClient.post(`${this.baseUrl}${url}`, value);
  }

  public deleteTask(id: string, url: string){
    return this.httpClient.delete(`${this.baseUrl}${url}${id}`);
  }

  public put(id: string, url: string, obj: IList | ITask){
    return this.httpClient.put(`${this.baseUrl}${url}${id}`, obj);
  }
}
