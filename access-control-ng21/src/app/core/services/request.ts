import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  //private apiUrl = 'http://localhost:3000/api/requests';
  private apiURL = `${environment.apiUrl}/requests`


  // Get all requests
  getRequests(): Observable<AccessRequest[]> {
    return this.http.get<AccessRequest[]>(this.apiURL);
  }

  // Get single request 
  getRequestById(id: string): Observable<AccessRequest> {
    return this.http.get<AccessRequest>(`${this.apiURL}/${id}`);
  }

  // Create a request
  //POST request return a single object, not an array, so AccessRequest not AccessRequest[]

  createRequest(payloads: AccessRequest): Observable<AccessRequest> {
    return this.http.post<AccessRequest>(`${this.apiURL}`, payloads);
  }

  // Update a request
  updateManagerApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Observable<AccessRequest> {
    return this.http.patch<AccessRequest>(`${this.apiURL}/${id}/manager-approval`, { decision });
  }

  updateSecurityApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Observable<AccessRequest> {
    return this.http.patch<AccessRequest>(`${this.apiURL}/${id}/security-approval`, { decision });
  }

  // Delete a request
  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }


}
