import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivatePage } from './private.page';

const routes: Routes = [
  {
    path: '',
    component: PrivatePage,
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'init',
        loadChildren: () =>
          import('./init/init.module').then((m) => m.InitPageModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatPageModule),
      },
      {
        path: '',
        redirectTo: 'init',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivatePageRoutingModule {}
