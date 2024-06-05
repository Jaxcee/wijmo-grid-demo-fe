import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  

  constructor(private _http :HttpClient) { }

  getEmployees(): Observable<any> {
    return this._http.get('http://localhost:8080/allemp');
  }

removeDuplicates(searchTerm?: string): Observable<void>{
  let params = new HttpParams();
  if(searchTerm){
    params = params.set('searchTerm' , searchTerm )
  }
  return this._http.delete<void> (`http://localhost:8080/removeDuplicates`,{params});
}

searchEmployee(employeeName:string) : Observable<any[]>{
  return this._http.get<any[]>('http://localhost:8080/searchEmployee?',{params:{employeeName}});
}

}
