import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';

const routes: Routes = [
  {path: '', redirectTo: '/library', pathMatch: 'full'},
  {path: 'library', component: BooksListComponent},
  {path: 'library/:id', component: BookDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
