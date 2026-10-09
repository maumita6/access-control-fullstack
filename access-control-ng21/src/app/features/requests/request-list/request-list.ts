import { Component, input, inject, output, signal, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService, AccessRequest } from '../../../core/services/request';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [ReactiveFormsModule, LowerCasePipe, CommonModule],
  templateUrl: './request-list.html',
  styleUrl: './request-list.css',
})
export class RequestListComponent {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);

  isLoading = signal<boolean>(false);
  requests = input.required<AccessRequest[]>();
  deleteClicked = output<string>();
  isModalOpen = signal<boolean>(false);
  selectedRequestId = signal<string | null>(null);


  @ViewChild('confirmModal') confirmModal!: ElementRef<HTMLDialogElement>;


  viewDetails(id?: string): void {
    //console.log('view details');
    if (id) {
      // console.log('Navigating to request details for ID:', id);
      this.router.navigate([`/requests`, id]);
    }
  }
  openModal() {
    console.log('Opening modal');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onDelete(id?: string) {
    if (id) {
      console.log('Delete clicked for request ID:', id);
      this.deleteClicked.emit(id);
    }
  }

  /*deleteRequest(id?: string) {
    if (!id) {
      console.error('No request ID provided for deletion.');
      return;
    }

    this.requestService.deleteRequest(id).subscribe({
      next: () => {
        this.requests.set(this.requests().filter(request => request._id !== id));
        console.log(`Request ${id} deleted successfully from deleteRequest method.`);

      },
      error: (err: any) => {
        console.error('Error deleting request:', err);
      }
    });
  }*/

  openDeleteDialog(id: string | undefined): void {
    if (!id) {
      console.error('No request ID provided for deletion.');
      return;
    }
    this.selectedRequestId.set(id);
    this.isModalOpen.set(true);
  }


  confirmDelete() {
    const ID = this.selectedRequestId();
    this.onDelete(ID || undefined);
    this.isModalOpen.set(false);
    this.selectedRequestId.set(null);

    /* if (this.confirmModal) {
       this.confirmModal.nativeElement.showModal();
       const confirmButton = this.confirmModal.nativeElement.querySelector('#confirmDeleteButton');
       const cancelButton = this.confirmModal.nativeElement.querySelector('#cancelDeleteButton');
 
       if (confirmButton && cancelButton) {
         confirmButton.addEventListener('click', () => {
           this.deleteClicked.emit(ID);
           this.confirmModal.nativeElement.close();
         });
 
         cancelButton.addEventListener('click', () => {
           this.confirmModal.nativeElement.close();
         });
       }
     }*/
  }

  /*deleteRequest() {
    if (!this.requests()) {
      console.error('No request loaded to delete.');
      return;
    }

    this.requestService.deleteRequest(this.requests()?._id!).subscribe({
      next: () => {
        console.log('Request deleted successfully');
        // Optionally, navigate away or update the UI after deletion
      },
      error: (err: any) => {
        console.error('Error deleting request:', err);
      }
    });
  }*/

}
