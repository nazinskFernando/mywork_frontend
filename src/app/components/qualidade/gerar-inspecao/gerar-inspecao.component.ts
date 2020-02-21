import { EquipamentoDTO } from './../../../model/DTO/Equipamento.DTO';
import { EquipamentoService } from './../../../services/domain/equipamento.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gerar-inspecao',
  templateUrl: './gerar-inspecao.component.html',
  styleUrls: ['./gerar-inspecao.component.css']
})
export class GerarInspecaoComponent implements OnInit {

  equipamento: EquipamentoDTO;
  constructor() { }


  ngOnInit() {
  
  }

  
}
