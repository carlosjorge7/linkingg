import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, first, interval, takeUntil } from 'rxjs';
import { AuthService } from 'src/shared/services/auth.service';
import { MesaggeService } from 'src/shared/services/message.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  timeDuration = 3000;
  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageSvr = inject(MesaggeService);
  private readonly authSvr = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
  }

  public onSubmit(): void {
    if (this.loading) {
      return; // Evita iniciar otra solicitud si ya está en curso
    }
    const user = this.form.value as User;
    // Cambiamos el estado de carga a true antes de iniciar el temporizador y la solicitud
    this.loading = true;
    this.startTimer();
    this.login(user);
  }

  private login(user: User): void {
    this.authSvr
      .login(user)
      .pipe(first())
      .subscribe({
        next: (credentials) => {
          this.authSvr.setCredentials(credentials);
          this.router.navigate(['private']);
          this.messageSvr.presentToast('Bienvenido/a');
        },
        error: () => {
          this.messageSvr.presentToast(
            'Error al hacer login. Revise sus credenciales'
          );
        },
      })
      .add(() => {
        // Cuando la solicitud se completa (éxito o error), cambiamos el estado de carga a false
        this.loading = false;
        this.destroy$.next(); // Detiene el intervalo después de que la suscripción se resuelve
      });
  }

  /**
   * To init form
   */
  private initForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$)) // Detiene el intervalo cuando se emite un valor en destroy$
      .subscribe(() => {
        this.timeDuration += 1000;
      });
  }

  public goBack(route: string): void {
    this.router.navigate([route]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Indica que el componente se está destruyendo
    this.destroy$.complete(); // Completa el observable
  }
}
