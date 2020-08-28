import { Injectable } from '@angular/core';
import { Book } from "../model/book";
import { BOOKS } from '../fake-database/book-list';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private books: Book[];

  constructor() {
    this.books = BOOKS;
  }

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

  saveEditedBook(selectedRow: number, book: Book): void{
    this.books[selectedRow] = JSON.parse(JSON.stringify(book));
  }

  deleteBook(selectedRow: number): void{
    this.books.splice(selectedRow, 1);
  }

  borrowBook(selectedRow: number, user: string): void {
    this.books[selectedRow].borrower = user;
  }
}
