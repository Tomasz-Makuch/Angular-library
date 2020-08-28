import { Injectable } from '@angular/core';
import { User } from "../model/user";
import { USERS } from '../fake-database/user-list';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[];

  constructor() {
    this.users = USERS;
  }

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(1000));
  }
}
