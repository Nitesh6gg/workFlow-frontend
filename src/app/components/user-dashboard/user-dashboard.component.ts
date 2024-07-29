import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { MiddlePageComponent } from "./middle-page/middle-page.component";


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, CommonModule, ToastModule, MiddlePageComponent],
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

  allAssignteamData:any;
  teamMembers: any;
   teamId: number=0;

  constructor(private api: ApiCallService,private router: Router,private cdr: ChangeDetectorRef, private notificationService: NotificationService) {}

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']); // Navigate to login page
  }
 
  ngOnInit(): void {

    this.showAllTeams();

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

  setTeamId(teamId: number): void {
    this.teamId = teamId;
    this.showAllTeamMembers(teamId);
  }

  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  }



  private showAllTeams() {
    this.api.getAllAssignTeam().subscribe({
      next: (data: any) => {
        this.allAssignteamData = data.content;
      },
      error: (error: any) => {
      }
    });
  }

  private showAllTeamMembers(teamId:number) {
    this.api.getAllTeamMembers(this.teamId).subscribe({
      next: (data: any) => {
        this.teamMembers = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}




