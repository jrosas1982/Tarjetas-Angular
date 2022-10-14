import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, observable, Subject } from 'rxjs';
import { TarjetaCredito } from '../models/TrajetaCredito';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  private tarjeta$ = new Subject<any>();
  constructor(private firestore: AngularFirestore) {

  }
  guardarTarjeta(Tarjeta: TarjetaCredito): Promise<any> {

    return this.firestore.collection('tarjetas').add(Tarjeta);
  }
  obtenrTarjeta(): Observable<any> {
    return this.firestore.collection('tarjetas', ref => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
  }
  
  editarTarjeta(id: string , tarjeta : TarjetaCredito) : Promise<any>{
  return this.firestore.collection('tarjetas').doc(id).update(tarjeta);
  }

  eliminarTarjeta(id: string): Promise<any> {
    return this.firestore.collection('tarjetas').doc(id).delete();
  }
  addTarjetaEdit(tarjeta: TarjetaCredito) {
    this.tarjeta$.next(tarjeta);
  }
  getTarjetaEdit(): Observable<TarjetaCredito> {
    return this.tarjeta$.asObservable();
  }
}
