import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NavbarComponent } from "../../core/layouts/main-layout/components/navbar/navbar.component";

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
