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
    MatExpansionModule, 
    MatDividerModule, 
    MatTabsModule
} from '@angular/material';

@NgModule({
  imports: [MatTabsModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDialogModule],
  exports: [MatTabsModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatCheckboxModule, MatDialogModule]
})
export class MaterialAppModule { }