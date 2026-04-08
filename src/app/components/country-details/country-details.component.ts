
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css']
})
export class CountryDetailsComponent implements OnInit {
    country: any;
    weather: any;
    errorMessage: string = '';

    constructor(
      private route: ActivatedRoute,
      private countryService: CountryService,
      private weatherService: WeatherService
    ) {}

    ngOnInit(): void {
        const name = 
        this.route.snapshot.paramMap.get('name');

        if(!name){
          this.errorMessage = 'Country not found';
          return;
        }
        this.countryService.getCountryByCode(name).subscribe({
          next: (data: any[]) => {
            this.country = data[0];
            
            if(this.country?.capital?.length >0 ){
              this.weatherService.getWeather(this.country.capital[0]).subscribe({
               next:  (res: any) => this.weather = res, 
               error: () => {
                this.errorMessage = 'Weather data not found';
               }
            });
            }
          },
          error: () => {
            this.errorMessage = 'Country not found';
          }
    });
    }
}
