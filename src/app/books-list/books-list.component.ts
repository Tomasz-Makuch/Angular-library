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
  selectedSearchFilter: string;
  users: User[];
  types = BookType;
  selectedRow: number;
  bookTypes = BookType;
  keysBookTypes: string[];
  bookToAdd: Book;
  bookToEdit: Book;
  filterType: string[];
  searchTextBoxActive: boolean;

  searchTextIsActive: boolean;
  addAlertSuccess: boolean;
  editAlertSuccess: boolean;

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
    this.searchTextBoxActive = false;
    this.addAlertSuccess = false;
    this.editAlertSuccess = false;
    this.selectedRow = -1;
    this.selectedSearchFilter = '';
    this.searchTextIsActive = false;
    this.filterType = ['isbn', 'title', 'author', 'type', 'number of pages', 'release date', 'borrowed by' ];
    this.keysBookTypes = Object.keys(this.bookTypes).filter(k => !isNaN(Number(k)));
    //this.filteredBooks = this.books;

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
    this._libraryService.getBooks().subscribe(booksSend => this.filteredBooks = booksSend);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }

  open(content) {
    this.modalService.open(content);
  }

  get searchTerm(): string{
    return this._searchTerm;
  }

  set searchTerm(searchValue: string){
    this._searchTerm = searchValue;
    this.filteredBooks = this.filter(searchValue);
  }

  filter(searchString: string): Book[]{
    switch (this.selectedSearchFilter) {
      case 'isbn': return this.books.filter(book =>  book.isbn.toString().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'title': return this.books.filter(book => book.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'author': return this.books.filter(book => book.author.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'type': return this.books.filter(book => this.bookTypes[book.type].toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'number of pages': return this.books.filter(book =>  book.pagesNumber.toString().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'release date': return this.books.filter(book => book.releaseDate.toString().toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'borrowed by': return this.books.filter(book => book.borrower.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
    }
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
    if (!this.checkIfBookWithIsbnExist()){
      this.addAlertSuccess = true;
      this._libraryService.addBook(this.bookToAdd);
      this.setBookToAddEmpty();
      this.addEditBookForm.reset();
    }
  }

  checkIfBookWithIsbnExist(): boolean{
    if(this.books.filter(book =>  book.isbn === this.bookToAdd.isbn).length > 0){
      alert('the book with this ISBN: ' + this.bookToAdd.isbn + ' already exist !!!');
      return true;
    }
    else{
      return false;
    }
  }

  deleteBook(): void{
    this._libraryService.deleteBook(this.selectedRow);
  }

  goToDetails(): void{
    this.router.navigate(['/library', this.selectedRow]);
  }

  onChangeFilterOption(value: string): void{
    this.searchTextIsActive = true;
    this._searchTerm = '';
    this.filteredBooks = this.books;
    this.searchTextBoxActive = true;
  }

  onSubmit(): void{
    this._libraryService.saveEditedBook(this.selectedRow, this.addEditBookForm.value);
  }

  closeAlert(): void {
    this.addAlertSuccess = false;
  }
}