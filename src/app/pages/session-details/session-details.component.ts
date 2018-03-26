import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {

  constructor() { }

  navStep = 0;


  ngOnInit() {
  }


  /* navigation steps */ 

  setStep(index: number) {
    this.navStep = index;
  }

  nextStep() {
    this.navStep++;
  }

  prevStep() {
    this.navStep--;
  }

  
}
