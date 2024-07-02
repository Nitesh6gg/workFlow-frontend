import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSound: HTMLAudioElement;

  constructor(private http: HttpClient) {
    this.notificationSound = new Audio();
    this.notificationSound.src = 'assets/notification1.wav';
  }

  playNotificationSound() {
    this.notificationSound.play();
  }

}  