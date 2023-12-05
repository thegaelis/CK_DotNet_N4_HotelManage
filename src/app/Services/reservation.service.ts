
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  apiUrl = environment.url
  constructor(private http:HttpClient) { }

  
  getAllReservation(){
    const url = `${this.apiUrl}/Reservation`;
    return this.http.get<any[]>(url)
  }

  getNumberReservation(id: string){
    const url = `${this.apiUrl}/ReservationRoom/GetReservationsByReservationID?id=${id}`;
    return this.http.get<any[]>(url)
  }

  checkIn(id:string){
    const url = `${this.apiUrl}/Reservation/CheckIn?IDReservation=${id}`;
    return this.http.get<any[]>(url)
  }

  getReservationByRoomId(id: string):Observable<any>{
    const url = `${this.apiUrl}/Reservation/GetReservationByRoom?IDRoom=${id}`
    return this.http.get<any>(url)
  }
  checkOut(id:string){
    const url = `${this.apiUrl}/Reservation/CheckOut?IDReservation=${id}`
    return this.http.get(url)
  }
  Book(data: any):any{
    const url = `${this.apiUrl}/Reservation/NewReserveRooms`
    return this.http.post<any>(url, data)
  }
  Cancel(id:string):any{
    const url = `${this.apiUrl}/Reservation/Cancel?IDReservation=${id}`
    return this.http.get<any>(url)
  }

}
