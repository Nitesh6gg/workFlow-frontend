import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private httpClient:HttpClient) { }
  
  login(username: string, password: string) {
    return this.httpClient.post(`${environment.apiurl}/api/auth/login`, { username, password });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.httpClient.put(`${environment.apiurl}/api/update/${userId}`, userData);
  }

  forgetPassword(email: string): Observable<any> {
    return this.httpClient.put<any>(`${environment.apiurl}/api/forget-password?email=${email}`, {}).pipe(
      catchError(error => {
        throw error.error;
      })
    );
  }
  
  //admin user sevice

  createUser(data:any): Observable<any> {
    return this.httpClient.post(`${environment.apiurl}/api/user/create`,data );
  }

  getAllDepartments(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/department/dropdown`);
  }

  getAllPosition(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/position/dropdown`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiurl}/api/admin/delete/${userId}`);
  }

  updateUserByAdmin(userId: number, userData: any): Observable<any> {
    return this.httpClient.put<any>(`${environment.apiurl}/api/admin/updateUser/${userId}`, userData);
  }

  getAllUser(page: number, size: number, sortBy: string, sortOrder: string): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/user/list?page=${page}&size=${size}&sortBy=${sortBy}&sort=${sortOrder}`);
  }

  searchName(name: string): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/admin/user/search/${name}`);
  }

  downloadExcel(): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob' as 'json', // Set the response type to blob
    });
    return this.httpClient.get<any>(`${environment.apiurl}/api/admin/downloadExcel`, { headers, observe: 'response', responseType: 'blob' as 'json' });
  }

  uploadExcelWithProgress(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadReq = new HttpRequest('POST', `${environment.apiurl}/api/admin/uploadExcel`, formData, {
      reportProgress: true // Enable progress tracking
    });

    return this.httpClient.request(uploadReq);
  }

  //project service

  getAllDepartment(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/department/dropdown`);
  }

  getAllManager(departmentId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/user/managerDropdown?departmentId=${departmentId}`);
  }

  getAllProject(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/project/list?page=0&size=5&sortBy=projectId&sortOrder=Desc`);
  }

  getAllProjectByStatus(projectStatus:String): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/project/status?projectStatus=${projectStatus}&page=0&size=5&sortBy=projectId&sortOrder=Desc`);
  }

  createProject(data:any): Observable<any> {
    return this.httpClient.post(`${environment.apiurl}/api/project/create`,data );
  }

  deleteProject(projectId: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiurl}/api/admin/project/delete/${projectId}`);
  }

  //admin task service

  getAllProjects(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/project/list-drop`);
  }

  getAllTeamLeader(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/task/tl-drop`);
  }

  getAllUsersDropDown(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/user/drop`);
  }



  getAllTask(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/task/list`);
  }
  createTask(data:any):Observable<any>{
    return this.httpClient.post(`${environment.apiurl}/api/task/save`,data );
  }

  deleteTask(taskId: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiurl}/api/admin/tasks/delete/${taskId}`);
  }

  getAllUpcomingTask(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/admin/tasks/upcoming`);
  }

  getAllClosedTask(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/admin/tasks/closed`);
  }

  //admin team service

  getAllTeam(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/team/list`);
  }

  getAllTeamMembers(teamId:number): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/teamMember/find?teamId=${teamId}`);
  }

  getAllTopPriorityUser(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/admin/team/top-priority-user`);
  }

  getAllLowPriorityUser(): Observable<any> {
    return this.httpClient.get(`${environment.apiurl}/api/admin/team/low-priority-user`);
  }

  createTeam(data:any):Observable<any>{
    return this.httpClient.post(`${environment.apiurl}/api/team/save`,data );
  }

  deleteTeam(teamId: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiurl}/api/admin/team/${teamId}`);
  }

  addMembersToTeam(teamId: number, memberIds: number[]): Observable<any> {
    const payload = { teamId, memberIds };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<any>(`${environment.apiurl}/api/team/addMembers`, payload, { headers });
  }

  //notifications

  // broadcastNotification(notification: Notification): Observable<void> {
  //   return this.httpClient.post<void>(`${environment.apiurl}/api/admin/notifications/broadcast`, notification);
  // }

  // sendPrivateNotification(userName: string, notification: Notification): Observable<void> {
  //   return this.httpClient.post<void>(`${environment.apiurl}/api/admin/notifications/private/${userName}`, notification);
  // }


   //sse notifications
   // Connect to SSE endpoint for receiving notifications
  getUserNotifications(): Observable<string> {
    return new Observable<string>(observer => {
      const eventSource = new EventSource(`${environment.apiurl}/api/user/get-notifications`);

      eventSource.onmessage = event => {
        observer.next(event.data);
      };

      eventSource.onerror = error => {
        observer.error('An error occurred with the SSE connection.');
      };

      // Return a cleanup function to close the connection
      return () => {
        eventSource.close();
      };
    });
  }

  sendNotification(notification: string): Observable<any> {
    return this.httpClient.post(`${environment.apiurl}/api/admin/send-notification`, notification);
  }

  //image
 
 
  updateUserImage(userId: number, imageData: any): Observable<any> {
    return this.httpClient.put(`${environment.apiurl}/api/user/updateImg/${userId}`, imageData);
  }

  getImageUrl(userId: number): Observable<Blob> {
    return this.httpClient.get(`${environment.apiurl}/api/user/${userId}/picture`, { responseType: 'blob' });
  }

  convertBlobToImage(data: Blob): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        observer.next(reader.result?.toString() || '');
        observer.complete();
      };
      reader.readAsDataURL(data);
    });
  }




}
