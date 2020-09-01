import { Injectable } from '@angular/core';
import { Book } from '../model/book';
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

  getBook(isbn: number): Observable<Book> {
    const index = this.books.findIndex(x => x.isbn === isbn);
    return of(this.books[index]).pipe(delay(1000));
  }

  getNumberOfBooks(): Observable<number> {
    return of(this.books.length).pipe(delay(1000));
  }

  addBook(book: Book): void{
    this.books.push(JSON.parse(JSON.stringify(book)));
  }

  saveEditedBook(isbn: number, book: Book): void{
    const index = this.books.findIndex(x => x.isbn === isbn);
    this.books[index] = JSON.parse(JSON.stringify(book));
  }

  deleteBook(isbn: number): void{
    const index = this.books.findIndex(x => x.isbn === isbn);
    this.books.splice(index, 1);
  }

  borrowBook(isbn: number, user: string): void {
    const index = this.books.findIndex(x => x.isbn === isbn);
    this.books[index].borrower = user;
  }
}
