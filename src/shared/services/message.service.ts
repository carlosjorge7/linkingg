import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MesaggeService {
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);

  public async presentToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });

    await toast.present();
  }

  public async presentAlertConfirm(
    tipo: string,
    extraMsg = ''
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar',
        message: `¿Estás seguro de que deseas ${tipo}? ${extraMsg}`,
        buttons: [
          {
            text: 'Cancelar',
            cssClass: 'custom-alert-button',
            handler: () => {
              resolve(false); // Resuelve la promesa con false
            },
          },
          {
            text: 'Aceptar',
            cssClass: 'custom-alert-button',
            handler: () => {
              resolve(true); // Resuelve la promesa con true
            },
          },
        ],
      });

      await alert.present();
    });
  }

  public async presentAlert(header: string, message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: 'Aceptar',
            cssClass: 'custom-alert-button',
            handler: () => {
              resolve(true);
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
