import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ITodoVM } from '../shared/models/todoVM';
import { TodoService } from '../shared/services/todo.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  _user: any;
  loadedUserSub: any;
  todoList: ITodoVM[];
  errorMessage: string;
  private _secureAPIEndpoint: string = "http://localhost:5001/api/v1/identity";
  private userClaims = [];


  constructor(private authSvc: AuthService,
              private todoSvc: TodoService) {  }

  ngOnInit() {
    this.loadedUserSub = this.authSvc.userLoadedEvent.subscribe(user=>
    {
      this._user = user;
    });
  }
  clearState() {
    this.authSvc.clearState();
  }
  getUser() {
    this.authSvc.getUser();
  }
  removeUser() {
    this.authSvc.removeUser();
  }
  startSigninMainWindow() {
    this.authSvc.startSigninMainWindow();
  }
  endSigninMainWindow() {
    this.authSvc.endSigninMainWindow();
  }
  startSignoutMainWindow() {
    this.authSvc.startSignoutMainWindow();
  }
  endSignoutMainWindow() {
    this.authSvc.endSigninMainWindow();
  }

  ngOnDestroy(){
    if(this.loadedUserSub.unsubscribe()){
      this.loadedUserSub.unsubscribe();
    }
  }

  callOpenAPI(){
    console.log('calling open API endpoint');
    this.todoList = [];
    this.todoSvc.getTodoList()
    .subscribe(todoList => {
      this.todoList = todoList; },
    error => this.errorMessage = <any>error);
  }

  callSecuredAPI(){
    console.log('calling secure API endpoint');
    this.userClaims = [];
    this.authSvc.AuthGet(this._secureAPIEndpoint)
    .flatMap((response) => response.json())
    .subscribe(data => {
      this.userClaims.push(data);
    },
    error => this.errorMessage = <any>error);

  };
}
