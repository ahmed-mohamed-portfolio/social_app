import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-verification-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss',
})
export class VerificationCodeComponent implements OnInit {
  constructor() { }
  private userService: UserService = inject(UserService);
  private toastrService: ToastrService = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private route: Router = inject(Router);
  email = input<string>('');
  codeForm!: FormGroup;
  code: string = '';

  ngOnInit(): void {
    initFlowbite();

    this.registerInitForm();

  }

  //all data input and validation
  registerInitForm() {
    this.codeForm = this.fb.group({
      codePart1: [null, [Validators.required]],
      codePart2: [null, [Validators.required]],
      codePart3: [null, [Validators.required]],
      codePart4: [null, [Validators.required]],
    });
  }

  regsterSubmit() {
    if (this.codeForm.valid) {
      this.register();
    } else {
      this.codeForm.markAllAsTouched();
    }
  }

  register() {
    this.code = `${this.codeForm.value.codePart1}${this.codeForm.value.codePart2}${this.codeForm.value.codePart3}${this.codeForm.value.codePart4}`;
    let data = {
      email: this.email() ? this.email() : sessionStorage.getItem('email'),
      code: this.code,
    };
    this.userService.verifyEmail(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data.confirmEmail) {
          this.toastrService.success('email verified');
          this.route.navigate(['/login']);
        }
      },
      error: (err) => {
        this.toastrService.error(err.error.message);

        console.log(err.message);
      },
    });
  }
}
