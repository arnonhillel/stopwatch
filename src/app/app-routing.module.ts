import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchComponent } from './watch/watch.component';

const routes: Routes = [
  { path: 'stopwatch',  component: WatchComponent },
  { path: '', redirectTo: 'stopwatch', pathMatch: 'full' },
  { path: '**', redirectTo: 'stopwatch' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
