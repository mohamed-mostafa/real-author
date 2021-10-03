import { ResearchesService } from "./../../../../services/researches.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-card-advance",
  templateUrl: "./card-advance.component.html",
  styleUrls: ["./card-advance.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CardAdvanceComponent implements OnInit {
  allResearches = [];
  constructor(private researchesService: ResearchesService) {}

  ngOnInit() {
    this.getAllResearches();
  }
  getAllResearches(): any {
    this.researchesService.getAllResearches().subscribe((result) => {
      this.allResearches = result;
      console.log(this.allResearches);
    });
  }
}
