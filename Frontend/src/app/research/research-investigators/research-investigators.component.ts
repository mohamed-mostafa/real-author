import { UsersService } from "./../../services/users.service";
import { ToastService } from "app/main/components/toasts/toasts.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
  public selectOptions = ["Approved", "Pending", "Declined"];
  public toastStyle: object = {};
  selectStatus = "";
  selectCanShowResult = "";
  selectedItems;
  editModal;
  @Input() data: any;
  constructor(
    private researchesService: ResearchesService,
    private usersService: UsersService,
    public toastService: ToastService,
    private modalService: NgbModal
  ) {}

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
  // modal Open Form
  modalOpenForm(modalForm, items) {
    this.selectedItems = items;
    this.selectStatus = items.researches.status;
    this.selectCanShowResult = items.researches.canShowResult;
    this.editModal = this.modalService.open(modalForm);
  }
  edit() {
    this.loading = true;
    this.selectedItems.researches.status = this.selectStatus;
    this.selectedItems.researches.canShowResult = this.selectCanShowResult;
    this.usersService
      .updateInvestigator(this.selectedItems._id, this.selectedItems)
      .subscribe(
        (result) => {
          this.loading = false;
          this.editModal.close();
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
  delete(item) {
    this.loading = true;
    this.researchesService
      .deleteInvestigator(this.data._id, item._id)
      .subscribe(
        (result) => {
          this.loading = false;
          this.getResearchInvestigators();
          this.toastService.show("Data has been deleted successfully", {
            delay: 4000,
          });
        },
        (error) => {
          console.log(error);
          this.error = error;
          this.loading = false;
        }
      );
  }
}
