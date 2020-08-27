import { Book } from "../model/book";
import { BookType } from "../model/book-types";
import { USERS } from '../fake-database/user-list';

export const BOOKS: Book[] = [

    {
        isbn: 1234567890123,
        title: 'Robinson Crusoe',
        author: 'Daniel Defoe',
        type: BookType.Adventure,
        pagesNumber: 342,
        releaseDate: new Date(2005, 11, 27),
        borrower: USERS[1].name,
    },

    {
        isbn: 3456789012312,
        title: 'Frankenstein',
        author: 'Mary Shelley',
        type: BookType.Horror,
        pagesNumber: 232,
        releaseDate: new Date(1995, 11, 17),
        borrower: '',
    },

    {
        isbn: 5477887586745,
        title: 'Hamlet',
        author: 'William Shakespeare',
        type: BookType.Romance,
        pagesNumber: 276,
        releaseDate: new Date(1999, 7, 24),
        borrower: USERS[3].name,
    },

    {
        isbn: 2334887342431,
        title: 'The Lord of the Rings',
        author: 'J. R. R. Tolkien',
        type: BookType.Fantasy,
        pagesNumber: 219,
        releaseDate: new Date(2001, 1, 30),
        borrower: '',
    },

    {
        isbn: 3245326542341,
        title: 'Gulliver’s Travels',
        author: 'Jonathan Swift',
        type: BookType.Adventure,
        pagesNumber: 329,
        releaseDate: new Date(1994, 9, 18),
        borrower: USERS[4].name,
    },
    {
        isbn: 6765754323312,
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        type: BookType.Romance,
        pagesNumber: 178,
        releaseDate: new Date(1998, 3, 30),
        borrower: '',
    }
];
