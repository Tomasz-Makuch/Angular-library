import { Component, OnInit } from '@angular/core';

import { Book } from '../model/book';
import { BookType } from '../model/book-types';
import { User } from '../model/user';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { LibraryService } from '../services/library.service';
import { UserService } from '../services/user.service';
import { BOOKS } from '../fake-database/book-list';


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit {
  books: Book[];
  filteredBooks: Book[];
  private _searchTerm: string;
  users: User[];
  types = BookType;
  selectedRow: number;
  bookTypes = BookType;
  keysBookTypes: string[];
  closeResult: string;
  bookToAdd: Book;
  bookToEdit: Book;
  filterType: string[];

  addEditBookForm = this.fb.group({
    isbn:  ['', [Validators.required, Validators.pattern('^\\d{13}$')]],
    title: ['', Validators.required],
    author: ['', Validators.required],
    type:  ['', Validators.required],
    pagesNumber: ['', [Validators.required, Validators.min(0)]],
    releaseDate: ['', Validators.required],
  });

  constructor(
      private _userService: UserService,
      private _libraryService: LibraryService,
      private modalService: NgbModal,
      private fb: FormBuilder,
      private router: Router) { 
      }

  ngOnInit(): void {
    this.selectedRow = -1;
    this.filterType = ['isbn', 'title', 'author', 'type', 'number of pages', 'release date', 'borrowed by' ];
    this.keysBookTypes = Object.keys(this.bookTypes).filter(k => !isNaN(Number(k)));
    this.filteredBooks = this.books;

    this.bookToAdd = {
      isbn: null,
      title: '',
      author: '',
      type: null,
      pagesNumber: null,
      releaseDate: null,
      borrower: '',
    };

    this._libraryService.getBooks().subscribe(booksSend => this.books = booksSend);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  get searchTerm(): string{
    return this._searchTerm;
  }

  set searchTerm(value: string){
    this._searchTerm = value;
    this.filteredBooks = this.filter(value);
  }

  filter(searchString: string): Book[]{
    return this.books.filter(book => book.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  setClickedRow(index: number, book: Book): void {
    this.selectedRow = index;
    this.bookToEdit = book;
  }

  setBookToAddEmpty(): void {
    this.bookToAdd.isbn = null;
    this.bookToAdd.title = '';
    this.bookToAdd.author = '';
    this.bookToAdd.type = null;
    this.bookToAdd.pagesNumber = null;
    this.bookToAdd.releaseDate = null;
    this.bookToAdd.borrower = '';
  }

  addNewBook(): void{
    this._libraryService.addBook(this.bookToAdd);
    this.setBookToAddEmpty();
    this.addEditBookForm.reset();
  }

  saveEditedBook(): void{
    this._libraryService.saveEditedBook(this.selectedRow, this.bookToEdit);
    alert('the book has been saved correctly');
  }

  deleteBook(): void{
    this._libraryService.deleteBook(this.selectedRow);
  }

  goToDetails(): void{
    this.router.navigate(['/library', this.selectedRow]);
  }
}