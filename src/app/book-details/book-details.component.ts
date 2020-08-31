import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { LibraryService } from '../services/library.service';
import { Book } from '../model/book';
import { User } from '../model/user';
import { BookType } from '../model/book-types';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  public selectedRow: number;
  public numberOfBooks: number;
  public bookToDisplayDetails: Book;
  public selectedUser: string;
  public users: User[];
  types = BookType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _libraryService: LibraryService,
    private _userService: UserService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = parseInt(params.get('id'));
      this.selectedRow = id;
    });

    this._libraryService.getBook(this.selectedRow).subscribe(book => this.bookToDisplayDetails = book);
    this._libraryService.getNumberOfBooks().subscribe(bookNum => this.numberOfBooks = bookNum);
    this._userService.getUsers().subscribe(usersSend => this.users = usersSend);
  }

  goPrevious(): void {
    let prevId: number;
    if(this.selectedRow === 0){
      prevId = 0;
    }
    else{
      prevId = this.selectedRow - 1;
    }
    this.router.navigate(['/library', prevId]).then(() => {
      window.location.reload();
    });;
  }

  goNext(): void{
    let nextId = this.selectedRow + 1;
    this.router.navigate(['/library', nextId]).then(() => {
      window.location.reload();
    });;
  }

  goToLibrary(): void{
    this.router.navigate(['/library']);
  }

  borrowBook(): void{
    this._libraryService.borrowBook(this.selectedRow, this.selectedUser);
  }

}
