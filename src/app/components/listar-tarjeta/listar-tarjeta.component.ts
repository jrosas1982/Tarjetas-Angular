import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from '../../services/tarjeta.service';
import { TarjetaCredito } from '../../models/TrajetaCredito';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css']
})
export class ListarTarjetaComponent implements OnInit {
  listaT: TarjetaCredito[] = [];

  constructor(private _tarjetaServices: TarjetaService,
    private toastr: ToastrService) {
  }

  ontenerTarjeta() {
    this._tarjetaServices.obtenrTarjeta().subscribe(doc => {
      this.listaT = [];
      doc.forEach((element: any) => {
        this.listaT.push(
          {
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          });
      });
    });
  }
  ngOnInit(): void {
    this.ontenerTarjeta();
  }

  editarTarjeta(item: TarjetaCredito) {
    this._tarjetaServices.addTarjetaEdit(item);
  }

  
  eliminarTarjeta(id: any) {
    this._tarjetaServices.eliminarTarjeta(id).then(() => {
      this.toastr.success('eliminada', 'Tarjeta eliminada')
    },
      error => {
        this.toastr.error('Error al eliminar', 'Error: ' + error)
      });
  }

}
