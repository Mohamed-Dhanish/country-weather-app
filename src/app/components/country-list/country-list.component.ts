import { Component } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { WeatherService } from 'src/app/services/weather.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent  {

 searchInput: string = '';

  
  weatherData: any;
  countryData: any;
  errorMessage: string = '';
  loading: boolean = false;
  forecast: any[]= [];

  constructor(private countryService: CountryService, private weatherService: WeatherService, 
    private router: Router
  ){}

  
search(): void {
    if (!this.searchInput) {
      this.errorMessage = 'Please enter a city or country';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.forecast = [];
    this.weatherData = null;
    this.countryData = null;

    this.countryService.getCountryByName(this.searchInput).subscribe({
      next: (countries: any[]) => {
        this.countryData = countries[0];

        const capital = this.countryData.capital?.[0];

        if(!capital){
          this.errorMessage = 'Capital city not found';
           this.loading = false;
          return;
        }

        this.weatherService.getWeather(capital).subscribe({
          next: (weather: any) => {
            this.weatherData = weather;
            this.loading = false;
            this.loadForecast(weather.name);
          },
          error: () => {
            this.errorMessage = 'Weather data is not found';
            this.loading = false;
          }
        });

      },

      error: () => {
        this.searchAsCity();
      }
    });    
  }

  searchAsCity(): void {
     this.loading = true;
    this.weatherService.getWeather(this.searchInput).subscribe({
      next: (weather: any) => {
        this.weatherData = weather;
        this.loadForecast(weather.name);
        
        const countryCode = weather.sys.country;

        this.countryService.getCountryByCode(countryCode).subscribe({
          next: (country: any[]) => {
            this.countryData = country[0];
             this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Country data not found';
          }
        });
      },
      error: () => {
        this.errorMessage = 'City or country not found';
        this.weatherData = null;
        this.countryData = null;
        this.forecast = [];
         this.loading = false;
      }
    });
  }
  
 goToDetails(countryName: string): void {
    this.router.navigate(['/country', countryName]);
  }

  isDarkMode = false;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode)
  }

  loadForecast(city: string) : void{
    this.weatherService.getFiveDayForecast(city).subscribe({
      next: (data: any) => {
        this.forecast = data.list.filter((_: any, i: number) => i % 8 === 0);
        this.loading = false;
      }
    })
  }

}

