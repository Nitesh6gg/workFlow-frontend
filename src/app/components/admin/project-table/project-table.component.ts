import { Component } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { log } from 'console';

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

  //page
  currentPage:any;
  totalPages:any;
  totalProject: number = 0; 
    
  allProjectData: any[] = []; // Ensure this is an array to store the projects
  

  allDepartment:any;
  allManagerData:any;

  selectedDepartmentId:number | undefined;

  project = {

    projectName: '',
    startDate: '',
    endDate: '',
    managerId: '',
    projectDescription: ''

  };

  constructor(private api: ApiCallService) {}

  ngOnInit(): void {
    
    this.showAllDepartment();
    this.showAllProjectData();

  }

  showAllProjectData() {
    this.api.getAllProject().subscribe({
      next: (data: any) => {
        this.allProjectData = data.items; // Access the items array from the API response
        this.totalProject = data.totalItems;
        this.currentPage=data.currentPage;
        this.totalPages=data.totalPages;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }


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
      projectName: this.project.projectName,
      startDate: this.project.startDate,
      endDate: this.project.endDate,
      managerId: this.project.managerId,
      description: this.project.projectDescription
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
    return !!(this.project.projectName && this.project.startDate && this.project.endDate && this.project.managerId && this.project.projectDescription);
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