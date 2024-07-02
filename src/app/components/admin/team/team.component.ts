import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { ApiCallService } from "../../../services/api-call.service";


@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,ReactiveFormsModule,ToastModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
  
})

export class TeamComponent {

  // add members to team
  teamId: number = 0; // Initialize with a default value
  userIdsInput: string = '';

 
  showToast: boolean = false;

  totalTeam: number = 0; 
  allTeamData: any;

  name: any; 
  description: any;
  teamLeader: any;

  leaderType: string = 'top'; // Default to top priority
  selectTeamLeader: string = ''; // Selected team leader

  // Arrays to store top and low priority leaders
  topPriorityLeaders: any[] = [];
  lowPriorityLeaders: any[] = [];
 
  
  constructor(private api: ApiCallService,) {}

  ngOnInit(): void {
    this.showAllTeam();
    this.loadTopPriorityLeaders(); // Load top priority leaders initially
    
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

  
  private showAllTeam() {
    this.api.getAllTeam().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allTeamData = data;
        //count total
        this.totalTeam = this.allTeamData.length;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  
  isValid(): boolean {
    // Check if any of the required fields are empty
    return  this.name && this.description && this.teamLeader;
  }


  createTeam() {
    const projectData = {
      name: this.name,
      description: this.description,
      teamLeader: this.teamLeader,
    };

    this.api.createTeam(projectData).subscribe(
      (response: any) => { 
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('Project Created successfully');
        this.showAllTeam()
        
      },
      (error: any) => {
        this.showToast =  error.message;
        console.log('Error Creating team', error);
        
      }
    );
  }

  

  loadTopPriorityLeaders() {
    this.api.getAllTopPriorityUser().subscribe((leaders: any[]) => {
      this.topPriorityLeaders = leaders;
    });
  }

  loadLowPriorityLeaders() {
    this.api.getAllLowPriorityUser().subscribe((leaders: any[]) => {
      this.lowPriorityLeaders = leaders; 
    });
  }

  onLeaderTypeChange() {
    if (this.leaderType === 'top') {
      this.loadTopPriorityLeaders(); // Load top priority leaders when type is changed to 'top'
    } else if (this.leaderType === 'low') {
      this.loadLowPriorityLeaders(); // Load low priority leaders when type is changed to 'low'
    }
  }

  deleteTeam(teamId: number) {
    this.api.deleteTeam(teamId).subscribe({
      next: (response: any) => {
        this.showToast = response.message;
        setTimeout(() => {
          this.hideToast();
        }, 3000);
        console.log('team deleted successfully');
        this.showAllTeam();
      
      },
      error: (error: any) => {
        this.showToast =  error.message;
        console.log('Error deleting Team:', error);
      }
    });
  }

  setTeamId(teamId: number): void {
    this.teamId = teamId;
  }

  addMembersToTeam(): void {
    const userIds: number[] = this.userIdsInput.split(',').map(id => +id.trim());
    this.api.addMembersToTeam(this.teamId, userIds).subscribe({
      next: (response: any) => {
        this.showToast = response.message;
        console.log('Members added successfully:', response);
        this.showAllTeam(); // Assuming this method exists to refresh the list of teams
      },
      error: (error: any) => {
        this.showToast = error.message;
        console.error('Error adding members:', error);
      }
    });
  }
  
  
}

