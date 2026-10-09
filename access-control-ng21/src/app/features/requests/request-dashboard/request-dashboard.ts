import { Component, inject, signal, OnInit } from '@angular/core';
import { RequestFormComponent } from '../request-form/request-form';
import { RequestListComponent } from '../request-list/request-list';
import { RequestService, AccessRequest } from '../../../core/services/request';


@Component({
  selector: 'app-request-dashboard',
  standalone: true,
  imports: [RequestFormComponent, RequestListComponent],
  templateUrl: './request-dashboard.html',
  styleUrl: './request-dashboard.css',
})
export class RequestDashboardComponent implements OnInit {

  private requestService = inject(RequestService);

  requests = signal<AccessRequest[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading.set(true);

    this.requestService.getRequests().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false)
      },
      error: () => this.loading.set(true)
    })
  }

  deleteRequestFun(id: string) {

    this.requestService.deleteRequest(id).subscribe({
      next: () => {

        this.requests.update(requests =>
          requests.filter(req => req._id !== id)
        );

      }
    });

  }

}
