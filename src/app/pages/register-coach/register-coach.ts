import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "../register/left/left";
import { Button } from "../../components/button/button";
import { Logo } from "../../shared/components/logo/logo";

@Component({
  selector: 'app-register-coach',
  imports: [RouterLink, Input, Left, Button, Logo],
  templateUrl: './register-coach.html',
  styleUrl: './register-coach.scss',
})
export class RegisterCoach {

}
