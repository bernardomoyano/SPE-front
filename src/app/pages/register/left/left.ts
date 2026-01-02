import { Component } from '@angular/core';
import { Logo } from "../../../shared/components/logo/logo";
import { CardRegister } from "../../../components/card-register/card-register";

@Component({
  selector: 'app-left',
  imports: [Logo, CardRegister],
  templateUrl: './left.html',
  styleUrl: './left.scss',
})
export class Left {

}
