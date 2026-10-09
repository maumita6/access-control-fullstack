import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccessRequest {
  _id?: string;
  requestName: string;
  system: string;
  access: 'READ' | 'WRITE' | 'READ_WRITE';
  duration: number;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  managerApproval?: 'PENDING' | 'APPROVED' | 'REJECTED';
  securityApproval?: 'LOCKED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: Date;
}


@Injectable({
  providedIn: 'root',
})
export class RequestService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/requests';

  //Returns an array []
  // Get all requests
  getRequests(): Observable<AccessRequest[]> {
    return this.http.get<AccessRequest[]>(this.apiUrl);
  }

  // Get single request 
  getRequestById(id: string): Observable<AccessRequest> {
    return this.http.get<AccessRequest>(`${this.apiUrl}/${id}`);
  }

  // Create a request
  createRequest(payloads: AccessRequest): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(this.apiUrl, payloads);
  }

  // Update a request
  updateManagerApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Observable<AccessRequest> {
    return this.http.patch<AccessRequest>(`${this.apiUrl}/${id}/manager-approval`, { decision });
  }

  updateSecurityApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Observable<AccessRequest> {
    return this.http.patch<AccessRequest>(`${this.apiUrl}/${id}/security-approval`, { decision });
  }

  // Delete a request
  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
