import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService, AccessRequest } from '../../../core/services/request';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './request-form.html',
  styleUrl: './request-form.css',
})
export class RequestFormComponent {

  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);

  requestCreated = output<void>();

  // State indicators using Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  requestForm: FormGroup = this.fb.group({
    requestName: ['', [Validators.required, Validators.minLength(3)]],
    system: ['Production Database', Validators.required],
    access: ['READ', Validators.required],
    duration: [48, [Validators.required, Validators.min(1)]]
  });


  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payLoad: AccessRequest = this.requestForm.value;

    this.requestService.createRequest(payLoad).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.requestForm.reset({
          system: 'Production Database',
          access: 'READ',
          duration: 48
        });
        console.log(payLoad);
        console.log('Request submitted successfully');
        this.requestCreated.emit();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to submit request. Please try again.');
        console.error(err);
      }
    })

  }

}
