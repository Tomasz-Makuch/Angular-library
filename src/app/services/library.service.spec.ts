import { TestBed } from '@angular/core/testing';

import { LibraryService } from './library.service';
import { Book } from '../model/book';

describe('LibraryService', () => {
  let service: LibraryService;
  const books: Book[] = [
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
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('list of books sholud be empty', () => {
  //   service.setBooks(books);
  //   expect(service.getNumberOfBooks.call().toEqual(2);
  // });
});
