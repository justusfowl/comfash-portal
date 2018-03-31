import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  public events: any[] = []; // use later to display form changes
  public hasError : boolean = false;
  

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {

    // the long way
    this.loginForm = new FormGroup({
        email: new FormControl('', [<any>Validators.required]),
        password: new FormControl('', <any>Validators.required),
    });

    this.
    loginForm.
      valueChanges.
      subscribe(form => {
        this.hasError = false;
      });


  }

  login(model, isValid: boolean) {
    this.submitted = true; // set form submit to true

    // check if model is valid
    // if valid, call API to save customer
    console.log(model, isValid);
    this.hasError = true;

}


}
