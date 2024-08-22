import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
// import { EnvironmentGuardService } from './services/environment-guard/environment-guard.service';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { DevOptionsCheckerService } from './services/dev-options-checker/dev-options-checker.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    // private environmentGuard: EnvironmentGuardService
    private device: Device, private router: Router,
    private devOptionsChecker: DevOptionsCheckerService,
  ) { }
  ngOnInit() {
    // this.environmentGuard.checkEnvironment();
     this.checkDevice();
    this.checkDeveloperOptions();
  }

 // dont let user to open from emulator or simulator but i will not use it now so i can code, ask hussain later

  private checkDevice() {
    console.log("cheking device", this.device);
    if (this.device.isVirtual) {
      console.log('Running on an emulator or simulator', this.device);
      this.router.navigate(['/dev-mode']);
    } else {
      console.log('Running on a physical device');
    }
  }

  private async checkDeveloperOptions() {
    try {
      const isDevMode = await this.devOptionsChecker.isDevOptionsEnabled();
      console.log("what is in ", isDevMode);
      if (isDevMode) {
        console.log('Developer options are enabled.');
        this.router.navigate(['/dev-mod']); // Redirect to a page that informs the user
      } else {
        console.log('Developer options are not enabled.');
        // You can handle the case where developer options are not enabled here if needed
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Failed to check developer options:', error);
    }
  }
}







