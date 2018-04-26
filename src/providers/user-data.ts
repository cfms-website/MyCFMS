import Auth0 from 'auth0-js';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import UserModel from '../models/user';
import UserRepository from '../repositories/api/user';

const config = {
    domain: "cfms.auth0.com",
    clientID: "DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ",
    responseType: 'token',
    scope: 'openid',
    audience: "https://cfms.auth0.com/api/v2/"
};

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  auth0 = {
    authentication: new Auth0.Authentication(config),
    webAuth: new Auth0.WebAuth(config)
  };
  UserRepository = new UserRepository(UserModel);

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  private generateAccessToken(username: string, password: string, cb?: (err: any, res?: any) => any) : Promise<{ accessToken: string, uid: string }> {
       return new Promise((resolve, reject) => {
         this.auth0.authentication.login({
            realm: "cfms-firebase",
            username: username,
            password: password
        }, (err: any, authResult: any) => {
            if (err) reject(err);
            this.storage.set('accessToken', authResult.accessToken);
            this.auth0.authentication.userInfo(authResult.accessToken, (err: any, user: any) => {
                if (err) reject(err);
                resolve({ accessToken: authResult.accessToken, uid: user.sub });
            });
        });
       });
  }

  login(username: string, password: string): void {
    this.generateAccessToken(username, password).then(res => {
      this.UserRepository.get(res.accessToken, res.uid).then((user: any) => {
        console.dir(user);
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setProfile(JSON.stringify(user.toRow()));
        // this.setUsername(username);
        this.events.publish('user:login');
      });
    });
  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.getProfile().then(profile => {
      profile.name = username;
      this.setProfile(JSON.stringify(profile));
    });
  };

  getUsername(): Promise<string> {
    return this.getProfile().then(profile => profile.name);
  };

  setProfile(profile: string): void {
    this.storage.set('profile', profile);
  }

  getProfile(): Promise<User> {
    return this.storage.get('profile').then(profile => {
      return new UserModel(profile);
    });
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
