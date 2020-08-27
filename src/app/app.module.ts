import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksListComponent } from './books-list/books-list.component';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LibraryService } from './services/library.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BookDetailsComponent } from './book-details/book-details.component';
//import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    BookDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
   // HttpClientModule
  ],
  providers: [LibraryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
