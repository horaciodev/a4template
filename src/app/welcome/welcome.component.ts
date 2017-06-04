import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
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

  constructor(private authSvc: AuthService) {  }

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

  callAPI(){
    if(this._user){
      console.log('Call API from here, use a different service');
    }
    else{
      console.log('You must login to call the API');
    }
  }

  private handleError(error: Response){
    console.log(error);
    return Observable.throw(error.json() || 'Server error');
  }
}
