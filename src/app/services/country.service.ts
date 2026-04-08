import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {}

  
  getCountryByName(name: string) {
    return this.http.get<any[]>(
      `https://restcountries.com/v3.1/name/${name}?fullText=true`
    );
  }

 
  getCountryByCode(code: string) {
    return this.http.get<any[]>(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
  }
}