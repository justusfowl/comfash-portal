import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-room',
  templateUrl: './my-room.component.html',
  styleUrls: ['./my-room.component.scss']
})
export class MyRoomComponent implements OnInit {
  

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goImgCollection(collection) {
    this.router.navigate(['imgCollection']); 
  }


}
