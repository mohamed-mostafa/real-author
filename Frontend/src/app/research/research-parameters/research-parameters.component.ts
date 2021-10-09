import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-research-parameters",
  templateUrl: "./research-parameters.component.html",
  styleUrls: ["./research-parameters.component.scss"],
})
export class ResearchParametersComponent implements OnInit {
  @Input() data: any;
  constructor() {}

  ngOnInit(): void {}
}
