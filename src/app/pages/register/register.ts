import { Component } from '@angular/core';
import { InputComponent as Input } from "../../components/input/input";
import { Left } from "./left/left";
import { Button } from "../../components/button/button";

@Component({
  selector: 'app-register',
  imports: [Input, Left, Button],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

}
