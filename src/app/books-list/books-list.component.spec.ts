import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BooksListComponent } from './books-list.component';
import { LibraryService } from '../services/library.service';
import { Component } from '@angular/core';
import { Book } from '../model/book';
import { By } from '@angular/platform-browser';
import { of} from 'rxjs';
import {NgxPaginationModule} from 'ngx-pagination';

describe('BooksListComponent', () => {
  let component: BooksListComponent;
  let fixture: ComponentFixture<BooksListComponent>;
  let complied: Element;
  let libraryServiceMock: any;

  beforeEach(async(() => {
    libraryServiceMock = jasmine.createSpyObj('LibraryService', ['getBooks']);
    libraryServiceMock.getBooks.and.returnValue(of([
      {
          isbn: 1234567890123,
          title: 'Robinson Crusoe',
          author: 'Daniel Defoe',
          type: null,
          pagesNumber: 342,
          releaseDate: new Date(2005, 11, 27),
          borrower: '',
      },
      {
          isbn: 3456789012312,
          title: 'Frankenstein',
          author: 'Mary Shelley',
          type: null,
          pagesNumber: 232,
          releaseDate: new Date(1995, 11, 17),
          borrower: '',
      }
    ])
    );
    TestBed.configureTestingModule({
      declarations: [ BooksListComponent],
      imports: [ FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([ {path: 'library', component: FakeComponent}])
      ],
      providers: [
        {provide: LibraryService, useValue: libraryServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    complied = fixture.nativeElement;
    component.selectedRow = 0;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('H1 name should be: School library', () => {
    expect(complied.querySelector('h1').textContent).toEqual('School library');
  });

  it('books list length should be 2', () => {
    expect(component.books.length).toBe(2);
  });

  it('second book title should be Frankenstein', () => {
    expect(component.books[1].title).toBe('Frankenstein');
  });

  it('Should be four buttons', () => {
    const buttonList = fixture.debugElement.queryAll(By.css('button'));
    expect(buttonList.length).toEqual(4);
  });

  it('Should be delete button', () => {
    const buttonList = fixture.debugElement.queryAll(By.css('button'));
    const deleteNativeButton = buttonList[2].nativeElement;
    expect(deleteNativeButton.textContent).toEqual('Delete');
  });

  it('Should be delete button clicked one time', () => {
    spyOn(component, 'deleteBook');
    const buttonList = fixture.debugElement.queryAll(By.css('button'));
    buttonList[2].triggerEventHandler('click', null);
    expect(component.deleteBook).toHaveBeenCalledTimes(1);
  });


  it('should show 6 list item when I have 100 books (becouse one tr is thead) and pagination = 5', () => {
    const fakeBooks: Book[] = new Array();
    for (let i = 0; i < 100 ; i++) {
        fakeBooks.push({
          isbn: i,
          title: '',
          author: '',
          type: null,
          pagesNumber: i,
          releaseDate: new Date(),
          borrower: null
        });
    }
    component.filteredBooks = fakeBooks;
    fixture.detectChanges();
    const tableItems = fixture.debugElement.queryAll(By.css('tr'));
    expect(tableItems.length).toBe(6);
  });
});

@Component({template: ''})
class FakeComponent{}

