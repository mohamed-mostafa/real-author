import { ToastrService } from "ngx-toastr";
import { UsersService } from "./../../services/users.service";
import { ResearchesService } from "./../../services/researches.service";
import { Component, Input, OnInit } from "@angular/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-research-general",
  templateUrl: "./research-general.component.html",
  styleUrls: ["./research-general.component.scss"],
})
export class ResearchGeneralComponent implements OnInit {
  @Input() data: any;
  public loading = false;
  public error = "";
  currentUser: any;
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  constructor(
    private researchesService: ResearchesService,
    private toastr: ToastrService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {}

  async participateInResearch() {
    this.loading = true;
    this.data.investigators.push(this.loggedIn.id);
    this.researchesService
      .UpdateResearchesData(this.data, this.data._id)
      .subscribe(
        (result) => {
          this.userService
            .participate(
              { id: this.data._id, parameters: {} },
              this.loggedIn.id
            )
            .subscribe(
              (result2) => {
                this.loading = false;
                this.toastr.success(
                  "You have participated successfully ",
                  "Success!",
                  {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                  }
                );
              },
              (error) => {
                console.log(error);
                this.error = error;
                this.loading = false;
              }
            );
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
