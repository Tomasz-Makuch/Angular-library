import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { BookType } from '../model/book-types';
import { User } from '../model/user';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';


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
  bookToAddOrEdit: Book;
  modalButtonName: string;
  filterType: string[];
  searchTextBoxActive: boolean;
  searchTextBoxIsActive: boolean;

  alertSuccess: boolean;
  alertFailure: boolean;
  isLoading: boolean;

  private modalRef: NgbModalRef;
  page: number = 1;

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
      private router: Router,
      private spinner: NgxSpinnerService) {
      }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    this.searchTextBoxActive = false;
    this.alertSuccess = false;
    this.alertFailure = false;
    this.selectedRow = -1;
    this.selectedSearchFilter = '';
    this.searchTextBoxIsActive = false;
    this.keysBookTypes = Object.keys(this.bookTypes).filter(k => !isNaN(Number(k)));

    this.bookToAddOrEdit = {
      isbn: null,
      title: '',
      author: '',
      type: null,
      pagesNumber: null,
      releaseDate: null,
      borrower: '',
    };
    this.filterType = Object.keys(this.bookToAddOrEdit);

    this._libraryService.getBooks().subscribe(booksSend => {
      this.books = booksSend;
      this.isLoading = false;
      this.spinner.hide();
    });
    this._libraryService.getBooks().subscribe(booksSend => this.filteredBooks = booksSend);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }

  openAddModal(content): void {
    this.closeAlert();
    this.setBookToAddEmpty();
    this.selectedRow = -1;
    this.modalButtonName = 'Add'
    this.modalRef = this.modalService.open(content);
  }

  openEditModal(content): void {
    this.closeAlert();
    this.modalButtonName = 'Save';
    this.modalRef = this.modalService.open(content);
  }

  get searchTerm(): string{
    return this._searchTerm;
  }

  set searchTerm(searchValue: string){
    this.selectedRow = -1;
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
    this.closeAlert();
    this.selectedRow = index;
    this.bookToAddOrEdit.isbn = book.isbn;
    this.bookToAddOrEdit.title = book.title;
    this.bookToAddOrEdit.author = book.author;
    this.bookToAddOrEdit.type = book.type;
    this.bookToAddOrEdit.pagesNumber = book.pagesNumber;
    this.bookToAddOrEdit.releaseDate = book.releaseDate;
    this.bookToAddOrEdit.borrower = book.borrower;
  }

  setBookToAddEmpty(): void {
    this.bookToAddOrEdit.isbn = null;
    this.bookToAddOrEdit.title = '';
    this.bookToAddOrEdit.author = '';
    this.bookToAddOrEdit.type = null;
    this.bookToAddOrEdit.pagesNumber = null;
    this.bookToAddOrEdit.releaseDate = null;
    this.bookToAddOrEdit.borrower = '';
  }
  checkIfBookWithIsbnExist(): boolean{

    const theSameBooks = this.books.filter(book =>  book.isbn === this.addEditBookForm.controls.isbn.value);

    if(theSameBooks.length === 0){
      return false;
    }

    else if((theSameBooks.length > 0) && (theSameBooks[0].isbn === this.bookToAddOrEdit.isbn)){
      return false;

    }
    else{
      return true;
    }
  }

  deleteBook(): void{
    this.closeAlert();
    this._libraryService.deleteBook(this.bookToAddOrEdit.isbn);
    this.filteredBooks = this.books;
    this.alertSuccess = true;
    this.selectedRow = -1;
  }

  goToDetails(): void{
    this.closeAlert();
    this.router.navigate(['/library', this.bookToAddOrEdit.isbn]);
  }

  onChangeFilterOption(value: string): void{
    this.searchTextBoxIsActive = true;
    this._searchTerm = '';
    this.filteredBooks = this.books;
    this.searchTextBoxActive = true;
  }

  onSubmit(): void{

    if (this.checkIfBookWithIsbnExist()){
      this.alertFailure = true;
    }
    else{
      this.alertSuccess = true;

      if (this.modalButtonName === 'Add'){
        this._libraryService.addBook(this.addEditBookForm.value);
      }

      else if (this.modalButtonName === 'Save'){
        this._libraryService.saveEditedBook(this.bookToAddOrEdit.isbn, this.addEditBookForm.value);
      }
    }
    this.closeModal();
    this.filteredBooks = this.books;

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

  closeAlert(): void{
    this.alertSuccess = false;
    this.alertFailure = false;
  }
}
