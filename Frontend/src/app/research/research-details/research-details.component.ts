import { ResearchesService } from "./../../services/researches.service";
import { UsersService } from "./../../services/users.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-research-details",
  templateUrl: "./research-details.component.html",
  styleUrls: ["./research-details.component.scss"],
})
export class ResearchDetailsComponent implements OnInit {
  // public

  public contentHeader: object;
  public data: any;
  public receivedData: any;
  public loading = false;
  public error = "";
  userRole: string;
  investigatorRole: string;
  select: string;
  research: any;
  investigator: any;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));

  // private
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   *
   */
  constructor(private router: Router, private httpUserService: UsersService) {
    this._unsubscribeAll = new Subject();
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras.state.data
    )
      this.receivedData = this.router.getCurrentNavigation().extras.state.data;
    else router.navigate(["/ui/researches"]);
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Researches",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Researches",
            isLink: true,
            link: "/",
          },
          {
            name: "Details",
            isLink: false,
          },
        ],
      },
    };
    this.userRole = this.loggedIn.role;
    this.loadService();
  }
  loadService() {
    this.select = "";
    this.loading = true;
    this.receivedData.progress =
      this.receivedData.status === "NEW"
        ? 0
        : this.receivedData.status === "IN PROGRESS"
        ? 50
        : 100;
    for (const investigator of this.receivedData.investigators) {
      if (investigator === this.loggedIn.id) {
        this.getUserInvestigator(
          this.receivedData._id,
          this.loggedIn.id
        ).subscribe(
          (res) => {
            this.investigator = res.body;
            this.investigatorRole = this.investigator.roles[0];
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
  }
  getUserInvestigator(researchId: string, userId: string) {
    return this.httpUserService.getUserResearch(userId, researchId);
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
