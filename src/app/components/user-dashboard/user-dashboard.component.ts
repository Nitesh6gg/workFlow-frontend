import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,RouterLink,CommonModule,ToastModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit, OnDestroy  {
  @Input() dropdownToggle: string | undefined;
  @Input() ariaLabelledby: string | undefined;

  

  
  notifications: string[] = [];
  private sseSubscription?: Subscription;

  username:any;
  userEmail:any;

  teamCard=[{
    color:'red',
    name:'asd'
  },{
    color:'blue',
    name:'asd'
    
  },{
    color:'green',
    name:'asd'
    
  },{
    color:'yellow',
    name:'asd'
    
  }] ;


  constructor(private api: ApiCallService,private router: Router,private cdr: ChangeDetectorRef, private notificationService: NotificationService) {}

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']); // Navigate to login page
  }
 
  ngOnInit(): void {

    const username=localStorage.getItem('username');
    this.username=username;
  
    const userEmail=localStorage.getItem('email');
    this.userEmail=userEmail;




    this.sseSubscription = this.api.getUserNotifications().subscribe({
      next: (notification: string) => {
        console.log('Notification received:', notification);
        this.notifications.push(notification);
        this.notificationService.playNotificationSound(); // Play notification sound
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Error with SSE connection:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sseSubscription) {
      this.sseSubscription.unsubscribe();
    }
  }

}




