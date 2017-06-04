import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserManager, Log, MetadataService, User } from 'oidc-client';
import { environment } from '../../../environments/environment'

const settings: any = {
  authority: 'http://localhost:5000',
  client_id: 'a4App',
  redirect_uri: 'http://localhost:5003/auth.html',
  post_logoout_redirect_uri: 'http://localhost:5003',
  response_type: 'id_token token',
  scope: 'openid profile sampleAPI',

  silent_redirect_uri: 'http://localhost:5003/silent-renew.html',
  automaticSilentRenew: true,

  filterProtocolClaims: true,
  loadUserInfo: true
};

@Injectable()
export class AuthService {
  mgr: UserManager = new UserManager(settings);
  userLoadedEvent: EventEmitter<User> = new EventEmitter<User>();
  currentUser: User;
  loggedIn = false;

  authHeaders: Headers;

  constructor(private http: Http) {
    this.mgr.getUser()
      .then((user)=>{
        this.loggedIn = true;
        this.currentUser = user;
        this.userLoadedEvent.emit(user);
      })
      .catch((err)=>{
          this.loggedIn = false;
      });

      this.mgr.events.addUserUnloaded(user =>{
        this.currentUser = user;
        if(!environment.production){
          console.log('authService addUserLoaded', user);
        }
      });

      this.mgr.events.addUserUnloaded((e)=>{
        if(!environment.production){
          console.log('user unloaded');
        }
        this.loggedIn=false;
      });
   }

   clearState(){
     this.mgr.clearStaleState().then(function(){
       console.log('clearStaleState success');
     })
     .catch(function(e){
       console.log('clearStaleState error',e.message);
     })
   }

   getUser(){
     this.mgr.getUser().then((user)=>{
       console.log('got user', user);
       this.currentUser = user;
       this.userLoadedEvent.emit(user)
     });
   }

   isLoggedInObs() : Observable<boolean>{
     return Observable.fromPromise(this.mgr.getUser()).map<User, boolean>((user) =>{
       if(user){
         return true;
       }
       else{
         return false;
       }
     });
   }

   removeUser(){
     this.mgr.removeUser().then(()=>{
       this.userLoadedEvent.emit(null);
       console.log('user removed');
     }).catch(function(err){
       console.log(err);
     });
   }

   startSigninMainWindow(){
     this.mgr.signinRedirect({ data: 'some data' }).then(function () {
      console.log('signinRedirect done');
    }).catch(function (err) {
      console.log(err);
    });
   }

   endSigninMainWindow() {
   this.mgr.signinRedirectCallback().then(function (user) {
     console.log('signed in', user);
   }).catch(function (err) {
     console.log(err);
   });
  }

  startSignoutMainWindow() {
    this.mgr.signoutRedirect().then(function (resp) {
      console.log('signed out', resp);
      setTimeout(5000, () => {
        console.log('testing to see if fired...');

      });
    }).catch(function (err) {
      console.log(err);
    });
  };

  endSignoutMainWindow() {
    this.mgr.signoutRedirectCallback().then(function (resp) {
      console.log('signed out', resp);
    }).catch(function (err) {
      console.log(err);
    });
  };

  /**
   * Example of how you can make auth request using angulars http methods.
   * @param options if options are not supplied the default content type is application/json
   */
  AuthGet(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.get(url, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    const body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.put(url, body, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.delete(url, options);
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

    const body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.post(url, body, options);
  }

  private _setAuthHeaders(user: any) {
    this.authHeaders = new Headers();
    this.authHeaders.append('Authorization', user.token_type + ' ' + user.access_token);
    this.authHeaders.append('Content-Type', 'application/json');
  }

  public _setRequestOptions(options?: RequestOptions) {

    if (options) {
      options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
    } else {
      options = new RequestOptions({ headers: this.authHeaders, body: '' });
    }

    return options;
  }


}
