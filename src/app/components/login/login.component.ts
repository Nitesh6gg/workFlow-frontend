import { Component, NgModule } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,UserDashboardComponent,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  username: string = '';
  password: string = '';

  errorMessage: string = '';

  constructor(private apiService: ApiCallService, private router: Router) {}

 /* login() {
    this.apiService.login(this.username, this.password).subscribe({next:(data)=>{
      localStorage.setItem("login",JSON.stringify(data))
      // Assuming the response structure has a 'message' field
      // this.errorMessage = data.message;
      this.router.navigate(['dashboard']);
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    }
    ,error:(err)=>{
      //this.errorMessage =  err.message;

    }
  }*/

  login() {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        const token = response.token;
        const username = response.username;
        const email=response.email;
        const userType = response.userRole;
  
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('userType', userType);
        
        if(userType === 'ROLE_USER'){
          this.router.navigate(['/dashboard']);
        }else if(userType === 'ROLE_ADMIN'){
          this.router.navigate(['/admin/dashboard']);
        }else if(userType === 'ROLE_SUPERADMIN'){
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error: any) => {
        console.error('Login failed', error);
      }
    });
  }

      // {next:(data)  => { 
      //   localStorage.setItem("login",response)
      //   // Assuming the response structure has a 'message' field
      //   this.errorMessage = response.message;
      //   setTimeout(() => {
      //     this.hideToast();
      //   }, 3000);
      //   // Redirect to dashboard upon successful login
      //   // this.router.navigate(['dashboard']);
      // },
      // (error: any) => {
      //   // Handling error message if present
      //   this.errorMessage =  error.message;
        
      // }
  // }



  // Method to hide the error message after 3 seconds
  hideToast() {
    this.errorMessage = '';
  }
}