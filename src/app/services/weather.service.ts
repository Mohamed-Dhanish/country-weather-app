import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '592ae3ac55655c6697dad1528ffcdf1f';

  constructor(private http: HttpClient) { }

  getWeather(city : string){
    return  this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`);
  }

  getFiveDayForecast(city: string){
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`);
      
    
  }
}
