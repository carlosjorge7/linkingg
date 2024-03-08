import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from 'src/shared/services/auth.service';
import { Subject, first, interval, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MesaggeService } from 'src/shared/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  timeDuration = 3000;
  loading = false;

  private readonly authSvr = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageSvr = inject(MesaggeService);
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
    this.register(user);
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private register(user: User): void {
    this.authSvr
      .register(user)
      .pipe(
        first(),
        tap((res) => {
          if (res) {
            this.messageSvr.presentToast('Usuario creado con exito');
            this.router.navigate(['public/login']);
          }
        })
      )
      .subscribe()
      .add(() => {
        // Cuando la solicitud se completa (éxito o error), cambiamos el estado de carga a false
        this.loading = false;
        this.destroy$.next(); // Detiene el intervalo después de que la suscripción se resuelve
      });
  }

  private startTimer(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$)) // Detiene el intervalo cuando se emite un valor en destroy$
      .subscribe(() => {
        this.timeDuration += 1000;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Indica que el componente se está destruyendo
    this.destroy$.complete();
  }
}
