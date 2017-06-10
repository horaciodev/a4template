import { Injectable } from '@angular/core';
import { ITodoVM } from '../models/todoVM';

import {Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class TodoService {
  constructor(private _http: Http) {  }

  private _apiEndpoint: string = "http://localhost:5001/api/v1/todo";

  getTodoList(): Observable<ITodoVM[]>{
    return this._http.get(this._apiEndpoint)
            .map((res: Response)=><ITodoVM[]>res.json())
            .do(data=> console.log('All' + JSON.stringify(data)))
            .catch(this.handleException);
  }

  getTodoList_Old(): Observable<ITodoVM[]>{
    let todoList$ = this._http
                .get(this._apiEndpoint, { headers: this.getHeaders(), body: ''})
                .map(this.mapTodoList)
                .do(data=> console.log('All' + JSON.stringify(data)))
                .catch(this.handleException);

    return todoList$;
  }

  private getHeaders(): Headers{
    let headers = new Headers();
    headers.append('Accept','application/json');
    return headers;
  }

  private mapTodoList(response: Response): ITodoVM[]{
    return response.json().results.map(this.transformTodo);
  }

  private transformTodo(r: any): ITodoVM{
    let todo = <ITodoVM>({
      Key: r.key,
      Name: r.name,
      IsComplete: r.isComplete
    });

    return todo;
  }

  private handleException(error: Response){
    console.log(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
