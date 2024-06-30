import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mdl-disabled',
  templateUrl: './mdl-disabled.component.html'
})
export class MdlDisabledComponent {
  ruleNumber: string = '';

  constructor(
    public dialogRef: MatDialogRef<MdlDisabledComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ruleNumber: string, disable: boolean }
  ) {
    this.ruleNumber = data.ruleNumber;
  }

  closeDialog(accepted: boolean): void {
    this.dialogRef.close(accepted);
  }
}
