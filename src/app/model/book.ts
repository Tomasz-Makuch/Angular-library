import { BookType } from "./book-types";

export interface Book {
    isbn: number;
    title: string;
    author: string;
    type: BookType;
    pagesNumber: number;
    releaseDate: Date;
    borrower?: string;
}