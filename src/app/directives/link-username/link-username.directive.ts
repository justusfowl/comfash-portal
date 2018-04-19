import { Input, Directive , ElementRef, HostListener} from '@angular/core';
import { Router } from "@angular/router";

@Directive({
  selector: '[linkUsername]'
})
export class LinkUsernameDirective {

  @Input() username: string;


  constructor(private el: ElementRef, private router: Router) {
    el.nativeElement.classList.add("link-username")
  }

 @HostListener('click', ['$event.target']) onClick(btn) {
    this.navTo(this.username);
  }

  navTo(user){
    this.router.navigate(['profile', user]); 
  }

}
