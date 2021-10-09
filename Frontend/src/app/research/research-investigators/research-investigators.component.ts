import { ResearchesService } from "../../services/researches.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-research-investigators",
  templateUrl: "./research-investigators.component.html",
  styleUrls: ["./research-investigators.component.scss"],
})
export class ResearchInvestigatorsComponent implements OnInit {
  public allInvestigators: any = [];
  public loading = false;
  public error = "";
  @Input() data: any;
  constructor(private researchesService: ResearchesService) {}

  ngOnInit(): void {
    this.getResearchInvestigators();
  }
  getResearchInvestigators(): any {
    this.loading = true;
    this.researchesService
      .getSingleResearchInvestigators(this.data._id)
      .subscribe(
        (result) => {
          this.allInvestigators = result;
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
