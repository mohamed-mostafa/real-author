import { takeUntil } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ResearchesService } from "./../../../../services/researches.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

@Component({
  selector: "app-card-advance",
  templateUrl: "./card-advance.component.html",
  styleUrls: ["./card-advance.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CardAdvanceComponent implements OnInit {
  // Public
  public coreConfig: any;
  public registerForm: FormGroup;
  public submitted = false;
  public loading = false;
  public error = "";
  public returnUrl: string;
  public allResearches = [];
  public sidebarToggleRef = false;
  image: any;
  imagePreview: any;

  // Private
  private _unsubscribeAll: Subject<any>;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private researchesService: ResearchesService,
    private router: Router,
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

    this.registerForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      abstract: ["", [Validators.required]],
    });

    // // Subscribe to config changes
    // this._coreConfigService.config
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((config) => {
    //     this.coreConfig = config;
    //   });
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
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  get f() {
    return this.registerForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("image", this.image);
    formData.append("data", JSON.stringify(this.registerForm.value));
    this.loading = true;
    this.researchesService.addResearch(formData).subscribe(
      (data) => {
        this.loading = false;
        this.toggleSidebar("new-research-sidebar");
        this.getAllResearches();
      },
      (error) => {
        this.error = error;
        this.loading = false;
      }
    );
  }
  onChooseImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
    }
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  showResearchDetails(research) {
    this.router.navigate(["researchDetails"], { state: { data: research } });
  }
}
