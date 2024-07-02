import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.scss'
})
export class ForgetComponent {
  email: string = '';
  responseMessage: string = '';
  isError: boolean = false;

  constructor(private apiService: ApiCallService) {}

  forget() {
    this.apiService.forgetPassword(this.email).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        this.isError = !response.success;
      },
      error: (error) => {
        this.responseMessage = 'An error occurred: ' + error.message;
        this.isError = true;
      }
    });
  }
}