import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../features/auth/services/user.service';
import { Router } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from "../../../core/layouts/main-layout/components/navbar/navbar.component";

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, InputComponent, FormsModule, RadioButtonModule, NavbarComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})

export class ChangePasswordComponent {

  private toastrService =inject(ToastrService)
  private readonly fb = inject(FormBuilder);
  changePassword!: FormGroup


  //api variables
  private userService: UserService = inject(UserService);
  private route: Router = inject(Router)
  

  ngOnInit(): void {
    
    initFlowbite();

    this.changePasswordInitForm();

  }

  //all data input and validation
  changePasswordInitForm() {

    this.changePassword = this.fb.group({

      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]],
      newPassword: [null, [Validators.required]],

    });

  }

 



  //when press submit
  ChangePassword() {

    if (this.changePassword.valid) {

      this.changePasswordFn();

    } else {
      this.changePassword.markAllAsTouched()
    }

  }


  //send login data to api and loader
  changePasswordFn() {
    
    this.userService.changePassword(this.changePassword.value).subscribe(
      {
        next: (res) => {

          console.log("register response", res);
          if (res.message == "success") {
            this.toastrService.success("password changed successfully")
            localStorage.setItem('token', res.token)
            this.route.navigate(["/timeLine"]);
          }

        },

        error: (err) => {
          console.log(err);
          this.toastrService.error(err.error.error)
        },

      })

  }



}
