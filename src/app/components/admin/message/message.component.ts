import { Component } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ApiCallService } from '../../../services/api-call.service';
import { log } from 'node:console';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [RouterLink,FormsModule,ReactiveFormsModule,CommonModule,],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

 //fetch user data with pagination
  users: User[] = []; // Initialize users array here

  //pagination 
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  sortBy: string = 'name';
  sortOrder: string = 'asc';

  //search
  searchQuery: string = ''; // Property to store the search query

  //chat
  selectedUser: any = null;


  constructor(private api: ApiCallService) {}

  ngOnInit() { 
    this.currentPage = 0;
    this.startChat(this.users);
   console.log(this.users);
   
   
  }

  startChat(user: any) {
    console.log("start chat")
    this.selectedUser = user;
    console.log(this.selectedUser);
    
  }
  

  showAllUserData() {
    this.api.getAllUser(this.currentPage, this.pageSize, this.sortBy)
      .subscribe({
        next: (data: any) => {
          this.currentPage = data.currentPage;
          this.totalPages = data.totalPages;
          this.totalItems = data.totalItems;
          this.users = data.users || [];
  
          // Loop through each user and load their profile picture
          this.users.forEach((user: any) => {
            this.loadUserProfilePicture(user.userId); // Pass user.id instead of userId
          });
        },
        error: (error: any) => {
          console.error('Error fetching user data:', error);
        }
      });
  }

  loadUserProfilePicture(userId: number) {
    this.api.getImageUrl(userId).subscribe(
      (response: Blob) => {
        this.api.convertBlobToImage(response).subscribe(
          (imageUrl: string) => {
            for(let a=0;a<this.users.length;a++){
              if(this.users[a].userId==userId){
                this.users[a].profilePicture=imageUrl
              }
            }
            console.log(this.users);
            
          },
          (error: any) => {
            console.error('Error converting Blob to image:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching user profile picture:', error);
      }
    );
  }

  //search
  search(): void {
    // Reset currentPage to 0 when performing a new search
    this.currentPage = 0;
    // Perform search only if searchQuery is not empty
    if (this.searchQuery.trim() !== '') {
      this.api.searchName(this.searchQuery).subscribe({
        next: (data: any) => {
          this.users = data; // Update users with the filtered data
          this.currentPage = 0; // Reset currentPage when search results are displayed
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


} 

  interface User{
    userId: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    createdON: string;
    password: string;
    roles: string;
    lastUpdate: string | null;
    imageUrl:String;   
    profilePicture: any;      
  }