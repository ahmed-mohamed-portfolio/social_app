import { routes } from './../../../app.routes';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../features/auth/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder);
  registerForm!: FormGroup

  //api variables
  private path: UserService = inject(UserService);
  private route: Router = inject(Router)
  isLoading = signal<boolean>(false)
  errorMsg = signal<string>("");
  subscribe:Subscription=new Subscription()
  

  ngOnInit(): void {

    this.registerInitForm();

  }

  //all data input and validation
  registerInitForm() {

    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]],
      rePassword: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required, Validators.pattern(/^([1-9]|[12][0-9]|3[01])-([1-9]|1[0-2])-\d{4}$/)]],
      gender:[null,[Validators.required,Validators.pattern(/^(male|female)$/)]]
    }, { validators: this.matchValid });

  }

 

// custom validation if password != repassword
  matchValid(vGroup: AbstractControl) {

    if (vGroup.get('password')?.value === vGroup.get('rePassword')?.value) {
      return null
    } else {

      vGroup.get('rePassword')?.setErrors({ matchpassword: true })
      return { matchpassword: true };
    }

  }


  //when press submit
  regsterSubmit() {

    if (this.registerForm.valid) {

      this.register();

    } else {
      this.registerForm.markAllAsTouched()
    }

  }


  //send login data to api and loader
  register() {
    this.subscribe.unsubscribe();
    this.isLoading.set(true);
    this.subscribe =this.path.signUp(this.registerForm.value).subscribe(
      {
        next: (res) => {

          console.log("register response", res);
          if (res.message == "success") {
            this.isLoading.set(false);
            this.route.navigate(["/login"]);
          }

        },

        error: (err) => {
          console.log(err);

          this.errorMsg.set(err.error.message);
          this.isLoading.set(false);
        },

      })

  }




}
