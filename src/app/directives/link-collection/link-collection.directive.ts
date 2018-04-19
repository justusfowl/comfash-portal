import { Input, Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from "@angular/router";

@Directive({
  selector: '[linkCollection]'
})
export class LinkCollectionDirective {

  @Input() collectionId: string;
  @Input() username: string;


  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.classList.add("link-collection")
  }

 @HostListener('click', ['$event.target']) onClick(btn) {
    this.navTo(this.collectionId);
  }

  navTo(collectionId){
    this.router.navigate(['/room', this.username, collectionId]); 
  }

}
