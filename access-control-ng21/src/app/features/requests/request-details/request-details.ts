import { Component, inject, output, signal, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestService, AccessRequest } from '../../../core/services/request';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-request-details',
  imports: [ReactiveFormsModule],
  templateUrl: './request-details.html',
  styleUrl: './request-details.css',
})



export class RequestDetailsComponent implements OnInit {

  private fb = inject(FormBuilder);
  private requestService = inject(RequestService);
  private route = inject(ActivatedRoute);

  userId = signal<string>('');
  request = signal<AccessRequest | null>(null);
  isLoading = signal<boolean>(false);

  successClass = signal<string>('text-success');
  dangerClass = signal<string>('text-danger');

  isModalOpen = signal<boolean>(false);

  pendingDecision = signal<'APPROVED' | 'REJECTED' | null>(null);
  approvalStage = signal<'MANAGER' | 'SECURITY' | null>(null);


  securityLocked = computed(() => {
    return !this.request() || this.request()?.managerApproval !== 'APPROVED';
  });


  constructor() {
    // Initialization logic can be added here
    this.route.paramMap.subscribe(params => {
      // const id = params.get('id');
      const id = params.get('id') ?? '';
      this.userId.set(id);
      console.log('Request ID from route:', id);
    });
  }

  ngOnInit(): void {
    this.loadRequestDetails();
  }

  loadRequestDetails() {
    if (!this.userId())
      return;

    this.requestService.getRequestById(this.userId()).subscribe({
      next: (data: AccessRequest) => {
        console.log('Request details loaded:', data);
        this.isLoading.set(false);
        this.request.set(data);
      },
      error: (err: any) => {
        this.isLoading.set(true);
      }
    })
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  submitDecision(decision: 'APPROVED' | 'REJECTED') {
    if (!this.request()) {
      console.error('No request loaded to submit decision.');
      return;
    }

    this.requestService.updateManagerApproval(this.userId()!, decision).subscribe({
      next: (updatedRequest: AccessRequest) => {
        console.log('Manager decision submitted:', updatedRequest);
        this.request.set(updatedRequest);

      },
      error: (err: any) => {
        console.error('Error submitting manager decision:', err);
      }
    });
  }

  submitSecurityDecision(decision: 'APPROVED' | 'REJECTED') {
    if (!this.request()) {
      console.error('No request loaded to submit decision.');
      return;
    }

    this.requestService.updateSecurityApproval(this.userId()!, decision).subscribe({
      next: (updatedRequest: AccessRequest) => {
        console.log('Security decision submitted:', updatedRequest);
        console.log(this.userId(), decision);
        this.request.set(updatedRequest);
        console.log('Updated request:', updatedRequest.securityApproval);

      },
      error: (err: any) => {
        console.error('Error submitting manager decision:', err);
      }
    });
  }

  openConfirmationModal(approvalStage: 'MANAGER' | 'SECURITY' | null) {
    // console.log('openConfirmationModal Opened ....');
    //this.pendingDecision.set(pendingDecision);
    this.approvalStage.set(approvalStage);
    this.isModalOpen.set(true);
  }

  confirmDecision(pendingDecision: 'APPROVED' | 'REJECTED'): void {
    //  console.log('confirmDecision clicked ...');
    this.pendingDecision.set(pendingDecision);
    if (!this.pendingDecision()) {
      console.error('No pending decision or approval stage set.');
      return;
    }

    if (this.approvalStage() === 'MANAGER') {
      this.submitDecision(this.pendingDecision()!);
    } else if (this.approvalStage() === 'SECURITY') {
      this.submitSecurityDecision(this.pendingDecision()!);
    }
    this.closeModal();
    this.pendingDecision.set(null);
    this.approvalStage.set(null);
  }
}
