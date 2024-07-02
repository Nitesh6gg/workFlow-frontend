import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ApiCallService } from '../../services/api-call.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-admin',
    standalone: true,
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [AdminDashboardComponent, RouterModule, RouterOutlet,ReactiveFormsModule,FormsModule,RouterLink,CommonModule]
})
export class AdminComponent implements OnInit {

  notification: string | undefined;

  username:any
  userEmail:any;


  recipientUsername: string | undefined;

  constructor(private api: ApiCallService,private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    this.username=username;
    this.userEmail=email;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']); // Navigate to login page
  }

  sendNotification(): void {
    if (this.notification) {
      this.api.sendNotification(this.notification).subscribe(() => {
        console.log('Notification sent successfully');
        // After sending notification, reload the notifications list
        
      });
    } else {
      console.error('Notification message is empty.');
    }
  }




}