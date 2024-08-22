import { Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentGuardService {

  constructor(private router: Router) {
    this.checkEnvironment();
  }

   checkEnvironment(): void {
    if (isDevMode()) {
      // Redirect to a "Not Available" or "Under Construction" page
      this.router.navigate(['/not-available']);
    }
  }
}
