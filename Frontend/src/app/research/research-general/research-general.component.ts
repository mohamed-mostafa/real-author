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
  loggedIn = JSON.parse(localStorage.getItem("currentUser"));
  constructor(
    private researchesService: ResearchesService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {}

  participateInResearch() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to participate!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7367F0",
      cancelButtonColor: "#E42728",
      confirmButtonText: "Yes",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ml-1",
      },
    }).then(function (result) {
      if (result.value) {
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
                    Swal.fire({
                      icon: "success",
                      title: "Successfully!",
                      text: "Your Data Has Been Added Successfully.",
                      customClass: {
                        confirmButton: "btn btn-success",
                      },
                    });
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
    });
  }
}
