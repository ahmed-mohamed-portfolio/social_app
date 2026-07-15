import { UserService } from './../services/user.service';
import { Component, PLATFORM_ID, signal } from '@angular/core';
import { inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.development';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {


  flag: boolean = true;
  private readonly fb = inject(FormBuilder)
  loginForm!: FormGroup;

  //api variables
  private path: UserService = inject(UserService);
  private route: Router = inject(Router);
  private toastrService = inject(ToastrService)
  protected readonly title = signal('login_by_gmail_frontend');
  private readonly activatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  errorMsg = signal<string>("");
  subscribe: Subscription = new Subscription()
  private googleInitialized = false;
  private platformId = inject(PLATFORM_ID);


  ngOnInit(): void {
    this.loginInitForm();
    this.handleGoogleRedirectError();

  }



  //for eye icon in html
  changeFlag() { this.flag = !this.flag }



  //all data input and validation
  loginInitForm(): void {

    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]]
    })

  }


  //when press submit
  loginSubmit() {

    if (this.loginForm.valid) {

      this.logIn();
    } else {
      this.loginForm.markAllAsTouched()
    }

  }



  //send login data to api and loader
  logIn() {

    this.subscribe.unsubscribe();
    this.subscribe = this.path.signIn(this.loginForm.value).subscribe(
      {
        next: (res) => {
          console.log("login response", res);

          if (res.data.existUser.confirmEmail) {
            if (res.message == "signin success") {

              this.toastrService.info("logged in successfully")
              this.route.navigate(["/timeLine"])


            }
          } else {
            this.toastrService.error("email not verified")

          }

        },

        error: (err) => {
          console.log(err);
          this.toastrService.error("wrong email or password")

        },

      })
  }




  loginWithGoogle() {


    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.googleInitialized) return;

    //*thats mean when i click on my button will click in the google hidden button
    const realGoogleButton = document.querySelector(
      '#google-btn div[role="button"]'
    ) as HTMLElement | null;

    realGoogleButton?.click();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof google !== 'undefined' && google?.accounts?.id) {
      this.initializeGoogle();
      return;
    }

    const script = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null;

    if (script) {
      script.addEventListener('load', () => {
        this.initializeGoogle();
      }, { once: true });
    }
  }

  private initializeGoogle(): void {
    if (typeof google === 'undefined' || !google?.accounts?.id) {
      console.error('Google SDK not loaded');
      return;
    }

    google.accounts.id.initialize({
      client_id: '454721329331-ieb8vd87r8mlk8bjf4p60ogm0n5biljd.apps.googleusercontent.com',
      ux_mode: 'redirect',
      login_uri: `${environment.baseUrl}users/signup/gmail`,
      context: 'signup',
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
      }
    );

    this.googleInitialized = true;


    // this.loginWithGoogle() // this is the function that work after click on button 
    // and i make it work automatic
  }

  private handleGoogleRedirectError(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const googleError = this.activatedRoute.snapshot.queryParamMap.get('googleError');

    if (!googleError) {
      return;
    }

    this.errorMsg.set(googleError);
    // this.toastrService.error(googleError, 'Google Sign Up Failed');
    this.router.navigate([], {
      queryParams: { googleError: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }



}
