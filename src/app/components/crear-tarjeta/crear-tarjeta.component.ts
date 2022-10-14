import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TarjetaCredito } from '../../models/TrajetaCredito';
import { TarjetaService } from '../../services/tarjeta.service';
import { ToastrService } from 'ngx-toastr';
import { ThisReceiver } from '@angular/compiler';


@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {

  forms: FormGroup;
  loading: boolean;
  titulo: string;
  id: string | undefined;
  constructor(private form: FormBuilder,
    private _tarjetaServices: TarjetaService,
    private toastr: ToastrService) {
    this.forms = this.form.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
    this.loading = false;
    this.titulo = 'AGREGAR TARJETA';
  }
  guardarTarjeta() {


    if (this.id === undefined) {
      //creamos una tarjeta
      this.crearTarjeta();
    }
    else {
      // editamos
      this.editarTarjeta(this.id);

    }
  }

  crearTarjeta() {
    const tCredito: TarjetaCredito = {
      titular: this.forms.value.titular,
      numeroTarjeta: this.forms.value.numeroTarjeta,
      fechaExpiracion: this.forms.value.fechaExpiracion,
      cvv: this.forms.value.cvv,
      fechaActualizacion: new Date(),
      fechaCreacion: new Date()
    }
    this.loading = true;
    this._tarjetaServices.guardarTarjeta(tCredito).then(() => {
      this.loading = false;
      this.forms.reset();
      this.showSuccess(tCredito.numeroTarjeta);
    },
      error => {
        this.loading = false;
        this.showError(tCredito.numeroTarjeta + ' Error Type:  ' + error);
      }

    );
  }
  editarTarjeta(id: string) {
    const tCredito: any = {
      titular: this.forms.value.titular,
      numeroTarjeta: this.forms.value.numeroTarjeta,
      fechaExpiracion: this.forms.value.fechaExpiracion,
      cvv: this.forms.value.cvv,
      fechaActualizacion: new Date()
    }
    this.loading = true;
    this._tarjetaServices.editarTarjeta(id, tCredito).then(() => {
      this.loading = false;
      this.titulo = "agregar tarjeta";
      this.forms.reset();
      this.id = undefined;
      this.toastr.info('Actualizada con exito', 'Actualizacion Exitosa')
    }, error => {
      console.log(error);
    });
  }

  showSuccess(numero: string) {
    this.toastr.success('Tarjeta registrada', 'Tarjeta ' + numero + ' registrada exitosamente');
  }
  showError(numero: string) {
    this.toastr.error('Fallo registro', 'La Tarjeta ' + numero + ' registrada exitosamente');
  }
  ngOnInit(): void {
    this._tarjetaServices.getTarjetaEdit().subscribe(data => {
      this.id = data.id;
      this.titulo = 'Editar tarjeta';
      this.forms.patchValue({
        titular: data.titular,
        cvv: data.cvv,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion
      });
      console.log(data);
    });

  }
}
