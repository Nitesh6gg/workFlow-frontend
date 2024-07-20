import { Component } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

import { response } from 'express';



@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,RouterLink,CommonModule,ToastModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  showToast: boolean = false;
 

  totalTask: number = 0; 
  allTaskData: any;
  allTeamLeaderData:any;
  allProjects:any;

  projectId: any; 
  description: any;
  status: any;
  priority: any;
  assignedUserId=0;
  startDate: any;
  dueDate: any;
  
  constructor(private api: ApiCallService,) {}

  ngOnInit(): void {
    this.showAllTaskData();
    this.showAllTeamLeaderData();
    this.showAllProjects();
    
  }

  show() {
    this.showToast = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000); // Adjust the duration as needed
  }

  hideToast() {
    this.showToast = false;
  }

  public showAllTaskData() {
    this.api.getAllTask().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allTaskData = data.content;
        //count total
        this.totalTask = this.allTaskData.length;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

   public showAllUpcomingTaskData() {
    this.api.getAllUpcomingTask().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allTaskData = data;
        //count total
        this.totalTask = this.allTaskData.length;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  public showAllClosedTaskData() {
    this.api.getAllClosedTask().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allTaskData = data;
        //count total
        this.totalTask = this.allTaskData.length;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  private showAllProjects() {
    this.api.getAllProjects().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allProjects= data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  private showAllTeamLeaderData() {
    this.api.getAllTeamLeader().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allTeamLeaderData= data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  createTask() {
    let projectData = {
      projectId: this.projectId,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignedUserId: this.assignedUserId,
      startDate: this.startDate,
      dueDate: this.dueDate
    };

    projectData.assignedUserId=Number(this.assignedUserId)
    this.api.createTask(projectData).subscribe(
      (response: any) => { 
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('Project Created successfully');
        this.showAllTaskData()
        
      },
      (error: any) => {
        this.showToast =  error.message;
        console.log('Error Creating Project', error);
        
      }
    );
  }

  isValid(): boolean {
    // Check if any of the required fields are empty
    return  this.startDate && this.dueDate && this.assignedUserId && this.description && this.status && this.projectId && this.priority;
  }

  deleteTask(taskId: number) {
    this.api.deleteTask(taskId).subscribe({
      next: (response: any) => {
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('task deleted successfully');
        this.showAllTaskData();
      
      },
      error: (error: any) => {
        this.showToast =  error.message;
        console.log('Error deleting Project:', error);
      }
    });
  }


}
