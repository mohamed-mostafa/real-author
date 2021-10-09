import { ColumnMode } from "@swimlane/ngx-datatable";
import { ResearchesService } from "../../services/researches.service";
import { Subject } from "rxjs";
import { FlatpickrOptions } from "ng2-flatpickr";
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

  // private
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   *
   */
  constructor(private router: Router) {
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
