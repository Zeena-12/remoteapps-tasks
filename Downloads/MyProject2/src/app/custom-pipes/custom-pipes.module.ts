import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractNamePipe } from './extract-name/extract-name.pipe'; 



@NgModule({
  declarations: [ ExtractNamePipe],
  imports: [
    CommonModule
  ],
  exports: [
    ExtractNamePipe // Export your pipe so it can be used in other modules
  ]
})
export class CustomPipesModule { }
