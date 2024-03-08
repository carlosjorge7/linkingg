import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { ProfileService } from './services/profile.service';
import { MesaggeService } from 'src/shared/services/message.service';
import { Profile } from './models/profile';
import { first } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  profile: Profile = {} as Profile;
  userId: string | null = '';

  private readonly authSvr = inject(AuthService);
  private readonly router = inject(Router);
  private readonly myDataService = inject(ProfileService);
  private readonly messageSvr = inject(MesaggeService);

  ionViewWillEnter(): void {
    this.userId = this.authSvr.getUserId();
    this.getUserProfile(Number(this.userId));
  }

  private getUserProfile(userId: number): void {
    this.myDataService
      .getProfile(userId)
      .pipe(first())
      .subscribe((res) => {
        this.profile = res;
      });
  }

  public async loggout(): Promise<void> {
    await this.authSvr.loggout();
    this.router.navigate(['/public']);
  }

  public async deleteAccount(): Promise<void> {
    const resultado = await this.messageSvr.presentAlertConfirm(
      'borrar la cuenta'
    );
    if (resultado) {
      this.myDataService
        .deleteProfile(this.userId as string)
        .pipe(first())
        .subscribe(() => {
          this.authSvr.loggout();
          this.router.navigate(['/public']);
        });
    }
  }
}
