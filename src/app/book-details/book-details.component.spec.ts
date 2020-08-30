import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsComponent } from './book-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LibraryService } from '../services/library.service';
import { UserService } from '../services/user.service';
import {Observable, of} from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let complied: Element;
  let libraryServiceMock: any;

  beforeEach(async(() => {
    libraryServiceMock = jasmine.createSpyObj('LibraryService', ['getBook', 'getNumberOfBooks']);
    libraryServiceMock.getBook.and.returnValue(of(
      {
          isbn: 1234567890123,
          title: 'Robinson Crusoe',
          author: 'Daniel Defoe',
          type: null,
          pagesNumber: 342,
          releaseDate: new Date(2005, 11, 27),
          borrower: '',
      }
    ));
    libraryServiceMock.getNumberOfBooks.and.returnValue(of(1));

    TestBed.configureTestingModule({
      declarations: [ BookDetailsComponent ],
      imports: [ FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {provide: LibraryService, useValue: libraryServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    complied = fixture.nativeElement;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('H1 name should be: Book details', () => {
    expect(complied.querySelector('h1').textContent).toEqual('Book details');
  });

  it('should first book borrow button be not hidden', () => {
    expect(complied.querySelector('.btn-success').hasAttribute('disabled')).toBeFalse();
  });


});
