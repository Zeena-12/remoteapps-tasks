import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as myGlobals from 'src/globals';
// import { Http } from 'src/globals';
import { AppServiceService } from '../appService/app-service.service';

// import { Account } from './user-Account.interface';
@Injectable({
  providedIn: 'root',
})
export class UserDataService implements OnInit {
  public logoutflag = false;
  countries: HTTPResponse;
  public userData: {
    email: string;
    password: string;
  };
  public masterData: any;
  private MobileMenu: number[] = [36, 38];
  private MobileSub: number[] = [168];
  private MobileEntry: number[] = [332];
  public Menu: any[] = [];
  public Sub: any[] = [];
  public Entry: any[] = [];
  public allMenu: any[] = [];
  public UserMenu: any = [];
  public HomeViewMenu: any = [];
  public activeUsers: any[] = [];
  public PlayerID: any = '';
  InboxCount = 0;
  NotificationCount = 0;
  public menuIDsForView: any[] = [];


  //Day In Lieu
  DayInLieu_BackDatedNumber: number | undefined;
  dayInLieuList: any;
  public CategorySetupList: any[];

  constructor(
    public router: Router,
    public platform: Platform,
    public http: HTTP,
    public nativeStorage: NativeStorage,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public appService: AppServiceService
  ) {
    // this.getUserMenu();
    // alert('12');
    this.CategorySetupList = [];
    console.log('userService Initialized');
    this.getmaster();
    this.fetchCategorySetup();
    this.retriveActive();
    this.getUserMenu();
    // this.retriveActive(); 
    console.log('masterData', this.masterData); 
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.getmaster();
      this.getUserMenu(); 
      this.retriveActive();

      console.log('masterData', this.masterData);
    });
  }

  /* addAccount(em: string, pas: string) {
        this.userData = {email: em, password: pas};
        this.nativeStorage.setItem('Auth', {Username: em, Password: pas});
        // console.log(this.userData.email);
    }*/

  verifyLogin(): boolean {
    return true;
  }

  redCard(error: any) {
    this.appService.dismissLoading();

    if (Number(error.status) == 401 || Number(error.status) == 403) {
      this.dismissAllTop();
      // this.logoutflag = true;
      // this.router.navigateByUrl("/login");
    } else {
      this.appService.emptyAlert('RemoteApps', myGlobals.httpError);
    }
  }

  async dismissAllTop() {
    this.appService.presentLoading();
    // return new Promise(async (resolve, reject) => {
    let done: any = false;

    const element: any = await this.modalCtrl.getTop();
    console.log('element', element);

    if (element && element != '') {
      console.log('modal3');
      element.dismiss().then((d: any) => {
        console.log('dismissed#in');
        this.dismissAllTop();
      });
    } else {
      // this.router.navigateByUrl('/login');
      // this.logoutflag = true;
      // this.appService.dismissLoading();
      this.navCtrl.navigateRoot('login').then(() => {
        this.logoutflag = true;
        this.appService.dismissLoading();
      });
    }
  }

  // doLogin() {
  //   const x = new FormData();
  //   x.append('UserName', this.userData.email);
  //   x.append('Password', this.userData.password);
  //   this.http.post(myGlobals.backend + 'Profile/Login', x, { withCredentials: true });
  // }

  getEmail(): string {
    return this.userData.email;
  }

  retriveMaster() {
    // console.log('retrivingMaster')
    return new Promise((resolve, reject) => {
      this.post(
        myGlobals.backend + 'Apps/getMasterDetail',
        {},
        { withCredentials: true }
      ).then(
        (data: any) => {
          this.masterData = data;
          this.masterData.EmployeeID = data.PersonID;
          this.masterData.EmployeeNumber = data.EmployeeNo;
          if (this.UserMenu.EnterprisePortal) {
            this.masterData.EnterprisePortalCanModify =
              this.UserMenu.EnterprisePortalCanModify;
          }

          // console.log('retrivingMaster#2', this.masterData)
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  retriveActive() {
    return new Promise((resolve, reject) => {
      this.post(
        myGlobals.backend + 'ComboBoxHelper/getActiveUsers',
        {},
        { withCredentials: true }
      ).then(
        (actdata) => {
          this.activeUsers = actdata;
          this.activeUsers.forEach((element) => {
            element.Text = element.Text.substr(element.Text.indexOf('.') + 1);
          });
          resolve(actdata);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  async fetchCategorySetup() {
    if (this.CategorySetupList.length === 0) {
      try {
        const res = await this.post(
          myGlobals.backend + 'Apps/getCategorySetup',
          {},
          { withCredentials: true }
        );
        this.CategorySetupList = res;
        console.log('fetchCategorySetup:', res);
        return true; // Return true if fetching is successful
      } catch (error) {
        console.error('Error fetching category setup:', error);
        return false; // Return false if there's an error
      }
    } else {
      console.log(
        'Category setup data already fetched:',
        this.CategorySetupList
      );
      return true; // Return true since data is already fetched
    }
  }

  async isCategoryEnabled(categoryId: number) {
    if (this.CategorySetupList.length < 1) {
      await this.fetchCategorySetup();
    }
    for (let category of this.CategorySetupList) {
      if (category.WKF_CategoryID === categoryId) {
        return category.IsEnabled;
      }
    }
    return false;
  }

  getmaster(): Observable<any> {
    return this.masterData;
  }

  getUserMenu() {
    this.UserMenu = [];

    return new Promise((resolve, reject) => {
      this.post(
        myGlobals.backend + 'Apps/getUserMenu',
        {},
        { withCredentials: true }
      ).then(
        (menudata) => {
          this.allMenu = menudata;
          this.menuIDsForView =[];
          menudata.forEach((menu: { PageID: any; }) => {
            menu.PageID ? this.menuIDsForView.push(menu.PageID) : null;
          });
          console.log('Menu ID For View:', this.menuIDsForView);

          const mainmenu = menudata;
          for (const nj of mainmenu) {
            nj.ModuleID = Number(nj.ModuleID);
            if (nj.ModuleID == 8 || nj.ModuleID == 35 || nj.ModuleID == 36) {
              this.UserMenu.EnterprisePortal = true;
              this.UserMenu.EnterprisePortalCanModify = nj.P_CanModify;
              this.UserMenu.EnterprisePortalEnName = nj.M_Name;
              this.UserMenu.EnterprisePortalArName = nj.M_AR_Name;
              this.UserMenu.EnterprisePortalIcon = nj.M_Icon;
            } else if (nj.ModuleID == 44) {
              this.UserMenu.EventManagement = true;
              this.UserMenu.EventManagementEnName = nj.M_Name;
              this.UserMenu.EventManagementArName = nj.M_AR_Name;
              this.UserMenu.EventManagementIcon = nj.M_Icon;
            } else if (nj.ModuleID == 1 || nj.ModuleID == 38) {
              this.UserMenu.HumanCapetal = true;
              this.UserMenu.HumanCapetalEnName = nj.M_Name;
              this.UserMenu.HumanCapetalArName = nj.M_AR_Name;
              this.UserMenu.HumanCapetalIcon = nj.M_Icon;
            } else if (nj.ModuleID == 5 || nj.ModuleID == 39) {
              this.UserMenu.EmployeeSelfService = true;
              this.UserMenu.EmployeeSelfServiceEnName = nj.M_Name;
              this.UserMenu.EmployeeSelfServiceArName = nj.M_AR_Name;
              this.UserMenu.EmployeeSelfServiceIcon = nj.M_Icon;
            } else if (nj.ModuleID == 27 || Number(nj.ModuleID) == 41) {
              this.UserMenu.Business = true;
              this.UserMenu.BusinessEnName = nj.M_Name;
              this.UserMenu.BusinessArName = nj.M_AR_Name;
              this.UserMenu.BusinessIcon = nj.M_Icon;
            } else if (nj.ModuleID == 14) {
              this.UserMenu.CooperateServices = true;
              this.UserMenu.CooperateServicesEnName = nj.M_Name;
              this.UserMenu.CooperateServicesArName = nj.M_AR_Name;
              this.UserMenu.CooperateServicesIcon = nj.M_Icon;
            } else if (nj.ModuleID == 11 || nj.ModuleID == 40) {
              this.UserMenu.Report = true;
              this.UserMenu.ReportEnName = nj.M_Name;
              this.UserMenu.ReportArName = nj.M_AR_Name;
              this.UserMenu.ReportIcon = nj.M_Icon;
            } else if (nj.ModuleID == 12) {
              this.UserMenu.DocumentManagement = true;
              this.UserMenu.DocumentManagementEnName = nj.M_Name;
              this.UserMenu.DocumentManagementArName = nj.M_AR_Name;
              this.UserMenu.DocumentManagementIcon = nj.M_Icon;
            } else if (nj.ModuleID == 19 || nj.ModuleID == 37) {
              this.UserMenu.SystemAdmin = true;
              this.UserMenu.SystemAdminEnName = nj.M_Name;
              this.UserMenu.SystemAdminArName = nj.M_AR_Name;
              this.UserMenu.SystemAdminIcon = nj.M_Icon;
            } else if (nj.ModuleID == 30) {
              this.UserMenu.ProjectManagement = true;
              this.UserMenu.ProjectManagementEnName = nj.M_Name;
              this.UserMenu.ProjectManagementArName = nj.M_AR_Name;
              this.UserMenu.ProjectManagementIcon = nj.M_Icon;
            } else if (nj.ModuleID == 7) {
              this.UserMenu.FinancialManagement = true;
              this.UserMenu.FinancialManagementEnName = nj.M_Name;
              this.UserMenu.FinancialManagementArName = nj.M_AR_Name;
              this.UserMenu.FinancialManagementIcon = nj.M_Icon;
            } else if (nj.ModuleID == 42) {
              this.UserMenu.WorkSpace = true;
            } else if (nj.ModuleID == 45) {
              this.UserMenu.Workplace = true;
              this.UserMenu.WorkplaceEnName = nj.M_Name;
              this.UserMenu.WorkplaceArName = nj.M_AR_Name;
              this.UserMenu.WorkplaceIcon = nj.M_Icon;
            } else if (nj.ModuleID == 33) {
              this.UserMenu.IT = true;
              this.UserMenu.ITEnName = nj.M_Name;
              this.UserMenu.ITArName = nj.M_AR_Name;
              this.UserMenu.ITIcon = nj.M_Icon;
            } else if (nj.ModuleID == 45) {
              this.UserMenu.Membership = true;
              this.UserMenu.MembershipEnName = nj.M_Name;
              this.UserMenu.MembershipArName = nj.M_AR_Name;
              this.UserMenu.MembershipIcon = nj.M_Icon;
            } else if (nj.ModuleID == 51) {
              this.UserMenu.Happiness = true;
              this.UserMenu.HappinessEnName = nj.M_Name;
              this.UserMenu.HappinessArName = nj.M_AR_Name;
              this.UserMenu.HappinessIcon = nj.M_Icon;
            }
            else if (nj.ModuleID == 52) {
              this.UserMenu.Ministry= true;
              this.UserMenu.MinistryEnName = nj.M_Name;
              this.UserMenu.MinistryArName = nj.M_AR_Name;
              this.UserMenu.MinistryIcon = nj.M_Icon;
            }
          }
          resolve(this.UserMenu);
        },
        (err) => {
          reject(err);
        }
      );
    });

    // #region ahmedArray
    // this.post(myGlobals.backend + 'Apps/getUserMenu', {}, {withCredentials: true}).then(menudata => {
    //     menudata.forEach(element => {
    //         this.MobileMenu.forEach(CheckMenu => {
    //             if (element.ModuleID === CheckMenu) {
    //                 this.MobileSub.forEach(CheckSub => {
    //                     if (element.SubModuleID === CheckSub) {
    //                         this.MobileEntry.forEach(CheckPage => {
    //                             if (element.PageID === CheckPage) {
    //                                 if (!this.Menu.includes(element.ModuleID)) {
    //                                     this.allMenu.push({
    //                                         ModuleID: element.ModuleID,
    //                                         M_Name: element.M_Name,
    //                                         M_AR_Name: element.M_AR_Name,
    //                                         M_Icon: element.M_Icon,
    //                                         sub: []
    //                                     });
    //                                     this.Menu.push(element.ModuleID);
    //                                 }
    //                                 if (!this.Sub.includes(element.SubModuleID)) {
    //                                     this.allMenu[this.allMenu.length - 1].sub.push({
    //                                         SubModuleID: element.SubModuleID,
    //                                         S_Name: element.S_Name,
    //                                         S_AR_Name: element.S_AR_Name,
    //                                         S_Icon: element.S_Icon,
    //                                         Pages: []
    //                                     });
    //                                     this.Sub.push(element.SubModuleID);
    //                                 }
    //                                 if (!this.Entry.includes(element.PageID)) {
    //                                     this.allMenu[this.allMenu.length - 1].sub[
    //                                     this.allMenu[this.allMenu.length - 1].sub.length - 1
    //                                         ].Pages.push({
    //                                         PageID: element.PageID,
    //                                         P_Name: element.P_Name
    //                                     });
    //                                     this.Entry.push(element.PageID);
    //                                 }
    //                                 if (element.ModuleID == 38 && !this.Sub.includes(1000)) {
    //                                     this.allMenu[this.allMenu.length - 1].sub.push({
    //                                         SubModuleID: 1000,
    //                                         S_Name: 'HCM Social',
    //                                         S_Icon: element.S_Icon,
    //                                         Pages: []
    //                                     });
    //                                     this.Sub.push(1000);
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // });
    // console.log('Main : ', this.Menu);
    // console.log('Sub: ', this.Sub);
    // console.log('Page: ', this.Entry);
    // console.log('Full Json ', this.allMenu);
    // #endregion
  }

  post(url: string | string[], body?: { [x: string]: string | Blob | (string | Blob)[] }, headers = {}): Promise<any> {
    // Ensure url is a string before performing string operations
    if (typeof url === 'string') {
        // Handle URL modification
        if (url[22] === '/' && (window as any).Ionic.isLiveReload) {
            url = url.substring(0, 21) + url.substring(22);
        }
    } else {
        // Handle case where url is an array
        console.warn('URL is an array, which is not supported in this implementation');
        return Promise.reject(new Error('Invalid URL format'));
    }

    // Check if body is defined
    let data: FormData;
    if (body instanceof FormData) {
        data = body;
    } else {
        data = new FormData();
        // Check if body is defined and an object
        if (body) {
            const keys = Object.keys(body);
            for (let key of keys) {
                let i = 0;
                if (Array.isArray(body[key])) {
                    console.log('array', key);

                    for (let val of body[key] as (string | Blob)[]) {
                        let k = key + '[' + i + ']';
                        if (typeof val === 'object' && !(val instanceof Blob)) {
                            const keys2 = Object.keys(val);
                            for (let key2 of keys2) {
                                let k2 = k + '[' + key2 + ']';
                                data.append(k2, (val as any)[key2]);
                            }
                        } else {
                            data.append(k, val);
                        }
                        i++;
                    }
                } else {
                    data.append(key, body[key] as string | Blob);
                }
            }
        }
    }

    data.forEach((value, key) => {
        console.log('[' + key + ']', value);
    });

    return new Promise((resolve, reject) => {
        this.http.setDataSerializer('multipart');
        this.http.post(url, data, {})
            .then((response) => {
                console.log('Warning: This URL is called from userService, URL', url);
                console.log('data', JSON.parse(response.data));
                resolve(response.data !== '' ? JSON.parse(response.data) : null);
            })
            .catch((error) => {
                console.log('error', error);
                console.log('error.status', error.status);
                console.log('error.error', error.error); // error message as string
                console.log('error.headers', error.headers);

                let err: any = { status: error.status };
                if (Number(error.status) === 401 || Number(error.status) === 403) {
                    this.redCard(error);
                }
                reject(err);
            });
    });
}



  getID(name: any , isHCM?: any , emp?: any,isTeam?: any) {

    let id;
    // (-1) means false
    // (-2) means true
    switch (name) {
      case 'General Information':
        id = isTeam? '-2': isHCM ? '333' : emp ? '393' : '-2';
        break;
      case 'Assignments':
        id = isTeam? '-2':isHCM ? '339' : emp ? '394' : '-2';
        break;
      case 'Competencies':
        id = isTeam? '-2':isHCM ? '335' : emp ? '395' : '-2';
        break;
      case 'Attendances':
        id = isTeam? '-2':isHCM ? '349' : emp ? '404' : '-2';
        break;
      case 'Excuse':
        id = isTeam? '-2':isHCM ? '350' : emp ? '424' : '-2';
        break;
      case 'Leave':
        id = isTeam? '-2':isHCM ? '345' : emp ? '419' : '-2';
        break;
      case 'Training Management':
        id = isTeam? '-2':isHCM ? '346' : emp ? '420' : '-2';
        break;
      case 'Business Trip':
        id = isTeam? '-2':isHCM ? '347' :emp ? '421' : '-2';
        break;
      case 'Letters':
        id = isTeam? '-2':isHCM ? '391' :emp ? '426' : '-2';
        break;
      case 'Payslip':
        id = isTeam? '-2':isHCM ? '675' :emp ? '405' : '-2';
        break;
      case 'Claim':
        id = isTeam? '-2':isHCM ? '617' :emp ? '422' : '-2';
        break;
      case 'Documents':
        id = isTeam? '-2':isHCM ? '338' :emp ? '398' : '-2';
        break;
      case 'Objective':
        id = isTeam? '-2':isHCM ? '374' :emp ? '406' : '-2';
        break;
      case 'Journal':
        id = isTeam? '-2':isHCM ? '369' :emp ? '406' : '-2';
        break;
      case 'Appraisal':
        id = isTeam? '-2':isHCM ? '369' :emp ? '406' : '-2';
        break;
      case 'Organization':
        id = isTeam? '-2':isHCM ? '357' :emp ? '653' : '-2';
        break;
      case 'Shift':
        id = isTeam? '-2':isHCM ? '348' :emp ? '401' : '-2';
        break;
      case 'Team':
        id = isTeam? '-2':isHCM ? '-1' : emp ? '438' : '-2';
        break;
      case 'TimeTracker':
        id = isTeam? '-2':isHCM ? '352' :emp ? '-1' : '-2';
        break;
      case 'Policy':
        id = '326';
        break;
      case 'Initiative':
        id = '671';
        break;
      case 'Services':
        id = '667';
        break;
      case 'Gallery':
        id = '328';
        break;  
      case 'Branches':
        id = '329';
        break;
      case 'Templates':
        id = '331';
        break;
      case 'Calendar':
        id = '327';
        break;  
      case 'Directory':
        id = '330';
        break; 
      case 'Home':
        id = '325';
        break;   
    }
    // console.log('My ID:', id);

    if (id == '-1') return false;
    else if (id == '-2') return true;
    else {
      if (this.menuIDsForView.includes(parseInt(id))) {
        // console.log(name, '-', id, ': true');
        return true;
      } else {
        // console.log(name, '-', id, ': false');
        return false;
      }
    }
  }

  getCountries(){
    this.http
      .post(myGlobals.backend + "ComboBoxHelper/getCountries",{}, {
        withCredentials: true
      })
      .then(
        data => {
          this.countries=data;
        },
              // error => {
        //   this.appService.redCard(error);
        // }
      );
  }
}
