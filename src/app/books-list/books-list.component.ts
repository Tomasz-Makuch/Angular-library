import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { BookType } from '../model/book-types';
import { User } from '../model/user';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { UserService } from '../services/user.service';


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
  searchTextBoxIsActive: boolean;

  alertSuccess: boolean;
  alertFailure: boolean;

  private modalRef: NgbModalRef;

  addEditBookForm = this.fb.group({
    isbn:  ['', [Validators.required, Validators.pattern('^\\d{13}$')]],
    title: ['', Validators.required],
    author: ['', Validators.required],
    type:  ['', Validators.required],
    pagesNumber: ['', [Validators.required, Validators.min(0)]],
    releaseDate: ['', Validators.required],
    borrower: [''],
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
    this.alertSuccess = false;
    this.alertFailure = false;
    this.selectedRow = -1;
    this.selectedSearchFilter = '';
    this.searchTextBoxIsActive = false;
    this.keysBookTypes = Object.keys(this.bookTypes).filter(k => !isNaN(Number(k)));

    this.bookToAdd = {
      isbn: null,
      title: '',
      author: '',
      type: null,
      pagesNumber: null,
      releaseDate: null,
      borrower: '',
    };
    this.filterType = Object.keys(this.bookToAdd);

    this._libraryService.getBooks().subscribe(booksSend => this.books = booksSend);
    this._libraryService.getBooks().subscribe(booksSend => this.filteredBooks = booksSend);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }

  open(content): void {
    this.modalRef = this.modalService.open(content);
  }

  get searchTerm(): string{
    return this._searchTerm;
  }

  set searchTerm(searchValue: string){
    this._searchTerm = searchValue;
    this.filteredBooks = this.filterBooks(searchValue);
  }

  filterBooks(searchString: string): Book[]{
    switch (this.selectedSearchFilter) {
      case 'isbn':
        return this.books.filter(book =>  book.isbn.toString().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'title':
        return this.books.filter(book => book.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'author':
        return this.books.filter(book => book.author.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'type':
        return this.books.filter(book => this.bookTypes[book.type].toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'pagesNumber':
        return this.books.filter(book =>  book.pagesNumber.toString().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'releaseDate':
        return this.books.filter(book => book.releaseDate.toString().toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
      case 'borrower':
        return this.books.filter(book => book.borrower.toLowerCase().indexOf(searchString.toLowerCase()) !== -1); break;
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
      this.alertSuccess = true;
      this._libraryService.addBook(this.bookToAdd);
      this.setBookToAddEmpty();
    }
    else{
      this.alertFailure = true;
    }
    this.closeModal();
  }

  checkIfBookWithIsbnExist(): boolean{
    return (this.books.filter(book =>  book.isbn === this.bookToAdd.isbn).length > 0);
  }

  deleteBook(): void{
    this._libraryService.deleteBook(this.selectedRow);
  }

  goToDetails(): void{
    this.router.navigate(['/library', this.selectedRow]);
  }

  onChangeFilterOption(value: string): void{
    this.searchTextBoxIsActive = true;
    this._searchTerm = '';
    this.filteredBooks = this.books;
    this.searchTextBoxActive = true;
  }

  onSubmit(): void{
    if (!this.checkIfBookWithIsbnExist()){
      this.alertSuccess = true;
      this._libraryService.saveEditedBook(this.selectedRow, this.addEditBookForm.value);
    }
    else{
      this.alertFailure = true;
    }
    this.closeModal();
  }

  closeAlertSuccess(): void {
    this.alertSuccess = false;
  }

  closeAlertFailure(): void {
    this.alertFailure = false;
  }

  closeModal(): void{
    this.addEditBookForm.reset();
    this.modalRef.close();
  }
}