import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  
   MatToolbarModule,
    MatSliderModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCheckboxModule, 
    MatDialogModule,
    MatExpansionModule, 
    MatDividerModule, 
    MatTabsModule,
    MatButtonToggleModule,
    MatAutocompleteModule
} from '@angular/material';

@NgModule({
  imports: [MatToolbarModule,MatButtonToggleModule, MatTabsModule, MatAutocompleteModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDialogModule],
  exports: [MatToolbarModule,MatButtonToggleModule, MatTabsModule, MatAutocompleteModule, MatDividerModule, MatExpansionModule, MatSliderModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatCheckboxModule, MatDialogModule]
})
export class MaterialAppModule { }