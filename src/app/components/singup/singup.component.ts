import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';



@Component({
  selector: 'app-singup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './singup.component.html',
  styleUrl: './singup.component.scss'
})
export class SingupComponent implements OnInit{

  userRegistrationForm: any;

  constructor(public fb: FormBuilder,private apiservice:ApiCallService) { }

  ngOnInit(): void {

    this.userRegistrationForm = this.fb.group({
      name:['',Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required,Validators.email],
      phone:['',Validators.required],
      position:['',Validators.required],
      password:['',Validators.required],
      role:['',Validators.required]
      
    });
  }

  submitForm() {
   console.log(this.userRegistrationForm);
    this.apiservice.createUser(this.userRegistrationForm.value).subscribe(data => {
      // Handle response data if needed
   });
  }
}

  


