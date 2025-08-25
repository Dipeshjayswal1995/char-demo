import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialog } from './confirmation-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmationDialog', () => {
  let component: ConfirmationDialog;
  let fixture: ComponentFixture<ConfirmationDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialog>>;


  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [
        ConfirmationDialog,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Confirm',
            message: 'Are you sure?',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialog);
    component = fixture.componentInstance;
  });

  it('1) should create', () => {
    expect(component).toBeTruthy();
  });

  it('2) should close dialog with true when onConfirm is called', () => {
    component.onConfirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('3) should close dialog with false when onCancel is called', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
