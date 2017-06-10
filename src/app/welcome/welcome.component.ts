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
    this.todoSvc.getTodoList().subscribe(todoList => this.todoList,
    error => this.errorMessage = <any>error);
  }

  callSecuredAPI(){
    if(this._user){
      console.log('Call API from here, use a different service');
    }
    else{
      console.log('You must login to call the API');
    }
  };
}
