import { ResearchesService } from "../../services/researches.service";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-research-rank",
  templateUrl: "./research-rank.component.html",
  styleUrls: ["./research-rank.component.scss"],
})
export class ResearchRankComponent implements OnInit {
  public allRanks: any = [];
  public loading = false;
  public error = "";
  @Input() data: any;
  constructor(private researchesService: ResearchesService) {}

  ngOnInit(): void {
    this.getResearchRanks();
  }
  getResearchRanks(): any {
    this.loading = true;
    this.researchesService.getSingleResearchRank(this.data._id).subscribe(
      (result) => {
        this.allRanks = result;
        this.calcPercentage(result);
        console.log(result);

        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.error = error;
        this.loading = false;
      }
    );
  }
  calcPercentage(data): void {
    if (data.length) {
      data[0].researches.percentage = 100;
      for (let i = 1; i < data.length; i++) {
        data[i].researches.percentage =
          Math.round(
            (data[i].researches.score / data[0].researches.score) * 1000
          ) / 10;

        if (data[i].researches.percentage < 50)
          data[i].researches.rankStatus = "Rejected";
      }
    }
  }
}
