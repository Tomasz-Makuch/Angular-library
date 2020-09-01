import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { Book } from '../model/book';
import { User } from '../model/user';
import { BookType } from '../model/book-types';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  public numberOfBooks: number;
  public bookToDisplayDetails: Book;
  public selectedUser: string;
  public users: User[];
  types = BookType;
  bookIsbn: number;
  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _libraryService: LibraryService,
    private _userService: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.spinner.show();

    this.bookToDisplayDetails = {
      isbn: null,
      title: '',
      author: '',
      type: null,
      pagesNumber: null,
      releaseDate: null,
      borrower: '',
    };

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.bookIsbn = parseInt(params.get('id'));
    });

    this._libraryService.getBook(this.bookIsbn).subscribe(book => {
      this.bookToDisplayDetails = book;
      this.isLoading = false;
      this.spinner.hide();
    });

    this._libraryService.getNumberOfBooks().subscribe(bookNum => this.numberOfBooks = bookNum);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }
  goToLibrary(): void{
    this.router.navigate(['/library']);
  }

  borrowBook(): void{
    this._libraryService.borrowBook(this.bookToDisplayDetails.isbn, this.selectedUser);
  }

}
