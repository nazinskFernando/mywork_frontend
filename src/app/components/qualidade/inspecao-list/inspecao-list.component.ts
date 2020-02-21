import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inspecao-list',
  templateUrl: './inspecao-list.component.html',
  styleUrls: ['./inspecao-list.component.css']
})
export class InspecaoListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("Inspeção list");
  }

}
