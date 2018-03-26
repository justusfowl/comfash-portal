import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  
    MatSliderModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCheckboxModule, 
    MatDialogModule,
    MatExpansionModule
} from '@angular/material';

@NgModule({
  imports: [MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDialogModule],
  exports: [MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatCheckboxModule, MatDialogModule]
})
export class MaterialAppModule { }