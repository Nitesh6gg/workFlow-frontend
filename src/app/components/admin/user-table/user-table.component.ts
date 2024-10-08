import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationService } from '../../../services/pagination/pagination.service';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [RouterLink,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {



  userType:any;

  // Add a property to track upload progress bar
  showProgressBar: boolean = false;
  progress: number = 0;

  showToast: boolean = false;

  


  allUsersData: any[] = [];

 //filter
 
  

  //search
  searchQuery: string = ''; // Property to store the search query

  allUserData: any;
  allDepartment:any;
  allPosition:any;
  userData: any;

  totalUsers: number = 0; 

  //response msg
  responseMessage: string = '';
  modelResponseMessage: string = '';

  //update
  updatedEmail: string = ''; 
  updatedPhone: string = ''; 

  //create fileds
  username:any;
  firstName:any;
  lastName:any;
  email:any;
  phone:any;
  department:any;
  position:any;
  password:any;
  role:any;

  //show img modal
  isModalOpen = false;
  modalImageUrl: string | null = null;

  constructor(private api: ApiCallService,public pagination: PaginationService) {}

  ngOnInit() { 
    this.userType=localStorage.getItem("userType");
    this.showAllUserData();
  }

  openModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    setTimeout(() => {
      this.modalImageUrl = null;
    }, 300); // Match the duration of the transition
  }

  clickOnUserAddSpeedDial(){
    this.showAllDepartment();
    this.showAllPosition();
  }

  showAllDepartment(){
    this.api.getAllDepartment().subscribe({
      next: (data: any) => {
        this.allDepartment=data;
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      }
    })
  }

  showAllPosition(){
    this.api.getAllPosition().subscribe({
      next: (data: any) => {
        this.allPosition=data;
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      }
    })
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

  showAllUserData = (): void => {
    const params = this.pagination.getPaginationParams();
    this.api.getAllUser(params.page, params.size, params.sort,).subscribe({
      next: (data: any) => {
        this.allUsersData = data.content;
        this.pagination.updatePagination(data);
      },
      error: (error: any) => {
        
      }
    });
  };



  //search
  search(): void {
    // Reset currentPage to 0 when performing a new search
   
    // Perform search only if searchQuery is not empty
    if (this.searchQuery.trim() !== '') {
      this.api.searchName(this.searchQuery).subscribe({
        next: (data: any) => {
          // Reset currentPage when search results are displayed
          // You may need to update other pagination-related properties here as well
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    } else {
      // If searchQuery is empty, show all user data
      this.showAllUserData();
    }
  }

  reset(){
    this.userData.username=''
  }
   createUser() {
    const userData = {
      username:this.username,
      firstName: this.firstName,
      lastName:this.lastName,
      email: this.email,
      phone: this.phone,
      department:this.department,
      position: this.position,
      password: this.password,
      role: this.role
    };

    this.api.createUser(userData).subscribe(
      (response: any) => { 
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        this.showAllUserData();
        console.log('Project Created successfully');
        this.reset();
        this.showAllUserData();
        
      },
      (error: any) => {
        this.showToast =  error.message;
        console.log('Error Creating Project', error);
        
      }
    );
  }

  

  

  deleteUser(userId: number) {
    this.api.deleteUser(userId).subscribe({
      next: (response: any) => {
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('User deleted successfully');
        this.showAllUserData()
      },
      error: (error: any) => {
        this.showToast = error.message;
        console.log('Error deleting user:', error);
      }
    });
  }

  updateUser(userId: number) {
    // Create a userData object with updated email and phone
    const userData = {
      email: this.updatedEmail,
      phone: this.updatedPhone,
      // You can add other properties here if needed
    };
    this.api.updateUserByAdmin(userId, userData).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          this.modelResponseMessage = response.message;
          this.showAllUserData()
          // Optionally, you can fetch updated user data or refresh the user list
        } else {
          console.log('User updated successfully');
        }
      },
      error: (error: any) => {
        console.log('Error updating user:', error);
      }
    });
  }

  //download excel data
  downloadExcel() {
    this.api.downloadExcel().subscribe((response) => {
      this.saveFile(response.body, 'usersExcelData.xlsx');
      
    });
  }

  private saveFile(data: any, filename: string) {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  //upload excel file
  // Modify the `onFileChange` method to upload the file with progress tracking
  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.showProgressBar = true; // Show the progress bar when uploading starts
      this.api.uploadExcelWithProgress(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total); // Update progress
          } else if (event.type === HttpEventType.Response) {
            this.showProgressBar = false; // Hide the progress bar when upload completes
            this.progress = 0; // Reset progress
            this.showAllUserData(); // Refresh user data after upload
          }
        },
        error: (error: any) => {
          console.error('Error uploading file:', error);
          this.showProgressBar = false; // Hide the progress bar on error
          this.progress = 0; // Reset progress
        }
      });
    }
  }

}

interface User{
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department:number;
  position: number;
  createdON: string;
  password: string;
  roles: string;
  lastUpdate: string | null;
  imageUrl:String;   
  profilePicture: any;      
}