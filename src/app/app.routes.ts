import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { ForgetComponent } from './components/forget/forget.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ProjectTableComponent } from './components/admin/project-table/project-table.component';
import { UserTableComponent } from './components/admin/user-table/user-table.component';
import { MessageComponent } from './components/admin/message/message.component';
import { TaskComponent } from './components/admin/task/task.component';
import { TeamComponent } from './components/admin/team/team.component';
import { AuthGuardService } from './services/authGuard/auth-guard.service';
import { MiddlePageComponent } from './components/user-dashboard/middle-page/middle-page.component';

export const routes: Routes = [

 // public routing   
 { path: '', redirectTo: '/home', pathMatch: 'full' }, 
 { path: "home", component: HomeComponent, title: "Home | Management" },
 { path: "login", component: LoginComponent, title: "Login | Management" },
 { path: "signup", component: SingupComponent, title: "Signup | Management" },
 { path: "forget", component: ForgetComponent, title: "Forget | Management" },

 // Admin routing
 { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
 { path: 'admin', component: AdminComponent,canActivate: [AuthGuardService], children: [
   { path: 'dashboard', component: AdminDashboardComponent, data: { title: 'Dashboard | Management' } },
   { path: 'project', component: ProjectTableComponent, data: { title: 'Project | Management' } },
   { path: 'users', component: UserTableComponent, data: { title: 'User | Management' } },
   { path: 'message', component: MessageComponent, data: { title: 'Message | Management' } },
   { path: 'task', component: TaskComponent, data: { title: 'Task | Management' } },
   { path: 'team', component: TeamComponent, data: { title: 'Team | Management' } }
 ]},

 // user routing
 { path: 'user', redirectTo: 'user/dashboard', pathMatch: 'full' },
 { path: 'dashboard',  component: UserDashboardComponent,canActivate: [AuthGuardService], children: [
   { path: 'home', component: MiddlePageComponent, data: { title: 'Home | Management' } },
   { path: 'team', component: TeamComponent, data: { title: 'Team | Management' } }
 ]}


 
];
