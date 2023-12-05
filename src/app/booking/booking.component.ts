import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomType } from '../Models/RoomType';
import { RoomTypeService } from '../_Services/room-type.service';
import { ReservationService } from '../_Services/reservation.service';
import { RoomService } from '../_Services/room.service';
import { GuestService } from '../_Services/guest.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  roomtypes: RoomType[] = [];
  mangSoLuongPhong: any = []
  dateCheckin: string = ""
  dateCheckout: string = ""
  FormBooking!: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private roomTypeService: RoomTypeService, private reservationService: ReservationService, private roomService: RoomService, private guestService: GuestService) { }
  ngOnInit() {
    this.FormBooking = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      sodienthoai: ['', [Validators.required, Validators.maxLength(10)]],
      yeucau: ['']
    })
    this.roomTypeService.getRoomType().subscribe((data: RoomType[]) => {
      this.roomtypes = data
    })

  }
  async onSubmit() {
    this.submitted = true;
    if (this.FormBooking.invalid) {
      return
    }
    else {
      if (this.dateCheckin == "" || this.dateCheckout == "") {
        alert("Bạn phải nhập ngày đến và ngày đi")
        return
      }
      else {
        let currentdate = new Date();
        let a = Date.parse(this.dateCheckin)
        let b = Date.parse(this.dateCheckout)
        let date1 = new Date(a);
        let date2 = new Date(b);
        if (date1 >= date2) {
          alert("Ngày đến phải nhỏ hơn ngày đi ít nhất 1 ngày")
          return
        }
        else if (date1 < currentdate) {
          alert("Bạn phải đặt phòng trước ít nhất 1 ngày")
          return
        }
        let check = false;
        this.mangSoLuongPhong = []
        let inputSoLuongPhong: any = document.getElementsByClassName("soluongphong")
        inputSoLuongPhong = [...inputSoLuongPhong]
        for (let i of inputSoLuongPhong) {
          let item = { id: i.id, name: i.name, number: i.value }
          this.mangSoLuongPhong.push(item);
          if (i.value > 0) check = true
        }
        if (!check) {
          alert("Bạn phải chọn số lượng phòng")
          return
        }
        let data = {
          "guestFullName": this.FormBooking.value.name,
          "guestPhoneNumber": "+" + this.FormBooking.value.sodienthoai,
          "guestEmail": this.FormBooking.value.email,
          "roomTypeId": "",
          "startTime": this.dateCheckin,
          "endTime": this.dateCheckout,
          "numberOfRooms": 0,
          "specialNote": this.FormBooking.value.yeucau
        }
        let checkSoLuongPhong = true
        for (let i of this.mangSoLuongPhong) {
          if (i.number == 0) continue
          data.roomTypeId = i.id
          data.numberOfRooms = Number(i.number)
          let slp = await this.roomService.getRoom(data).toPromise()
          if (slp!.length < data.numberOfRooms) {
            checkSoLuongPhong = false
          }
        }

        if (checkSoLuongPhong) {
          for (let i of this.mangSoLuongPhong) {
            if (i.number == 0) continue
            data.roomTypeId = i.id
            data.numberOfRooms = Number(i.number)
            await this.reservationService.DatPhong(data).toPromise()

          }
          this.guestService.hoten = this.FormBooking.value.name
          this.guestService.email = this.FormBooking.value.email
          this.guestService.sdt = this.FormBooking.value.sodienthoai
          this.guestService.yeucau = this.FormBooking.value.yeucau
          this.guestService.checkin = this.dateCheckin
          this.guestService.checkout = this.dateCheckout
          this.guestService.mangSoLuongPhong = this.mangSoLuongPhong
          this.router.navigate(['/successbooking'])
        }
        else {
          alert("Khách sạn không đủ phòng")
        }


      }
    }

  }



}
