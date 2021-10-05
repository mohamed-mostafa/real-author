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
  public loading = false;
  public error = "";
  constructor(private researchesService: ResearchesService) {}

  ngOnInit() {
    this.getAllResearches();
  }
  getAllResearches(): any {
    this.loading = true;
    this.researchesService.getAllResearches().subscribe(
      (result) => {
        this.allResearches = result;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
}
