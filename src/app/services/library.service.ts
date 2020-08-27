import { Injectable } from '@angular/core';

import { Book } from "../model/book";
import { BookType } from "../model/book-types";
import { USERS } from '../fake-database/user-list';
import { BOOKS } from '../fake-database/book-list';
import { User } from "../model/user";
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
//import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  books: Book[] = BOOKS;
  /*private _urlBooks: string = '/assets/data/books.json';
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this._urlBooks);
  }*/

  getBooks(): Observable<Book[]> {
    return of(this.books).pipe(delay(1000));
  }

  getBook(selectedRow: number): Observable<Book> {
    return of(this.books[selectedRow]).pipe(delay(1000));
  }

  getNumberOfBooks(): Observable<number> {
    return of(this.books.length);
  }

  addBook(book: Book): void{
    this.books.push(JSON.parse(JSON.stringify(book)));
  }

  saveBook(selectedRow: number, book: Book): void{
    this.books[selectedRow] = JSON.parse(JSON.stringify(book));
  }

  deleteBook(selectedRow: number): void{
    this.books.splice(selectedRow, 1);
  }

  borrowBook(selectedRow: number, user: string): void {
    console.log('wypo w serwisie' + selectedRow + '   ' + user);
    this.books[selectedRow].borrower = user;
  }



}
