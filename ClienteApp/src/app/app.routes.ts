import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Tareas } from './components/tareas/tareas';
import { AuthGuard } from './services/auth-guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'tareas', component: Tareas, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }