import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ExtractNamePipe } from './extract-name/extract-name.pipe'; 
import { ExtractNamePipe } from './extract-name/extract-name';
import { DateFormatPipe } from './date-format/date-format';
import { FullDatePipe } from './full-date/full-date.pipe';



@NgModule({
  declarations: [ ExtractNamePipe, DateFormatPipe, FullDatePipe],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractNamePipe,
    DateFormatPipe,
    FullDatePipe
     // Export your pipe so it can be used in other modules
  ]
})
export class CustomPipesModule { }
