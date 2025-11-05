import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../features/auth/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputComponent,RouterLink,FormsModule, DatePicker,RadioButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  
  private toastrService =inject(ToastrService)
  
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder);
  registerForm!: FormGroup
  date: Date | undefined;
  ingredient!: string;


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
      dateOfBirth: [null, [Validators.required]],
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
            this.toastrService.success("account created successfully")
            this.isLoading.set(false);
            this.route.navigate(["/login"]);
          }

        },

        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error.error)
          this.errorMsg.set(err.error.message);
          this.isLoading.set(false);
        },

      })

  }




}
