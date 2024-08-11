import { Component } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { log } from 'console';
import { PaginationService } from '../../../services/pagination/pagination.service';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.scss'
})
export class ProjectTableComponent {
  
  responseMessage: string = '';
  showToast: boolean = false;
  modelResponseMessage:boolean = false;


  allProjectData: any[] = []; // Ensure this is an array to store the projects


  allDepartment:any;
  allManagerData:any;

  selectedDepartmentId:number | undefined;

  
    projectName:string | undefined;
    startDate: String | undefined;
    endDate: String | undefined;
    managerId: number | undefined;
    projectDescription: string | undefined;
  

  constructor(private api: ApiCallService,public pagination:PaginationService) {}

  ngOnInit(): void {
    
    this.showAllDepartment();
    this.showAllProjectData();

  }

  
  showAllProjectData = (): void => {
    const params = this.pagination.getPaginationParams();
    this.api.getAllProject(params.page, params.size, params.sort,).subscribe({
      next: (data: any) => {
        this.allProjectData = data.content; 
        this.pagination.updatePagination(data);
      },
      error: (error: any) => {
        
      }
    });
  };

  showAllProjectByStatus(projectStatus:String){
    this.api.getAllProjectByStatus(projectStatus).subscribe({
      next: (data: any) => {
        this.allProjectData = data.content; 
        
      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }

  onInProgressClick(){
    this.showAllProjectByStatus('Initiation');
  }

  onClosedClick(){
    this.showAllProjectByStatus('Closed');
  }

  //project creating
  showAllDepartment() {
    this.api.getAllDepartment().subscribe({
      next: (data: any) => {
        this.allDepartment= data;
      },
    });
  }

  onDepartmentChange(): void {
    if (this.selectedDepartmentId != null) {
      this.showAllManagerData(this.selectedDepartmentId);
    } else {
      this.allManagerData = [];
    }
  }

  showAllManagerData(departmentId: number) {
    this.api.getAllManager(departmentId).subscribe({
      next: (data: any) => {
        this.allManagerData = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  createProject() {
    const payload = {
      projectName: this.projectName,
      startDate: this.startDate,
      endDate: this.endDate,
      managerId: this.managerId,
      description: this.projectDescription
    };

    this.api.createProject(payload).subscribe(
      (response: any) => {
        this.modelResponseMessage = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('Project Created successfully');
        this.showAllProjectData()
      },
      (error: any) => {
        this.modelResponseMessage = error.message;
        console.log('Error Creating Project', error);
        // Handle error
      }
    );
  }

  show() {
    this.modelResponseMessage = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000); // Adjust the duration as needed
  }

  hideToast() {
    this.modelResponseMessage = false;
  }

  isValid(): boolean {
    // Check if any of the required fields are empty
    return !!(this.projectName && this.startDate && this.endDate && this.managerId && this.projectDescription);
  }
  

  deleteProject(projectId: number) {
    this.api.deleteProject(projectId).subscribe({
      next: (response: any) => {
        this.responseMessage = response.message;
        console.log('User deleted successfully');
        this.showAllProjectData()
        // Handle any further logic or UI updates here
      },
      error: (error: any) => {
        this.responseMessage = 'An error occurred: ' + error.message;
        console.log('Error deleting Project:', error);
        // Handle error
      }
    });
  }

  


}