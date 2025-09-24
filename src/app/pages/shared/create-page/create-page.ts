import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-create-page',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.scss'
})
export class CreatePage {
  fileName = '';

  constructor(public dialogRef: MatDialogRef<CreatePage>) { }

  animal() {
    this.dialogRef.close(false);
  }

  onNoClick() {

  }

  selectName(){
    this.dialogRef.close(this.fileName);
  }
}
