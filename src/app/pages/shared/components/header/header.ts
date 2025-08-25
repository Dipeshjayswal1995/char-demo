import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header {
  @Output() sidebarToggle = new EventEmitter<void>();
  constructor(private readonly dialog: MatDialog, private readonly router:Router) {

  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }


  onLogout() {
    // const dialogRef = this.dialog.open(ConfirmationDialog, {
    //   width: '420px',
    //   disableClose: true,
    //   data: {
    //     title: `Confirm Deletion`,
    //     message: `Are Sure wan't to logout ?`,
    //     confirmButtonText: 'Logout',
    //     confirmButtonColor: 'warn',
    //     cancelButtonText: 'Cancel',
    //     cancelButtonColor: '',
    //     icon: 'logout'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     localStorage.clear();
    //     this.router.navigate(['/login']);
    //     this.notifyService.success("Logout Sucessfully...!!")
    //   }
    // });
  }
}
