import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/user';
import { UserService } from 'src/app/Services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserComponent } from '../modals/modal-user/modal-user.component';
import { SnackbarService } from '../../Services/snackbar.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  users: User[] = [];
  searchValue: string = '';
  constructor(private userService: UserService, public dialog: MatDialog, private snkbr: SnackbarService) { }

  ngOnInit() {
    this.userService.getAllUser().subscribe(users => {
      this.users = users.filter((user: User) => user.roles.includes("Staff"));
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      width: '50vw', // Chỉnh kích thước theo chiều ngang

      data: { action: "Add" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  openUpdateDialog(idUser: string): void {
    const dialogRef = this.dialog.open(ModalUserComponent, {
      width: '50vw', // Chỉnh kích thước theo chiều ngang

      data: { action: "Update", id: idUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteUser(id: string) {

    this.userService.deleteUser(id).subscribe(data => {

      this.ngOnInit();
      this.snkbr.openSnackBar("User Delete Succesfully", 'success');

    })

  }

  onSearchChange() {
    if (!this.searchValue.trim) {
      this.userService.getAllUser().subscribe(users => {
        this.users = users.filter((user: User) => user.roles.includes("Staff"));
      });
    }
    else {
      this.userService.getAllUser().subscribe(users => {
        this.users = users.filter((user: User) => user.roles.includes("Staff"));
        this.users = this.users.filter((user: User) => user.userName.includes(this.searchValue));
      });
    }
    console.log(this.users);
  }
}