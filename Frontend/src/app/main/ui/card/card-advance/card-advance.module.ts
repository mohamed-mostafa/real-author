import { CoreSidebarModule } from "./../../../../../@core/components/core-sidebar/core-sidebar.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CoreCommonModule } from "@core/common.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { CardAdvanceService } from "app/main/ui/card/card-advance/card-advance.service";
import { CardAdvanceComponent } from "app/main/ui/card/card-advance/card-advance.component";

// routing
const routes: Routes = [
  {
    path: "researches",
    component: CardAdvanceComponent,
    resolve: {
      chatWidget: CardAdvanceService,
    },
    data: { animation: "researches" },
  },
];

@NgModule({
  declarations: [CardAdvanceComponent],
  imports: [
    RouterModule.forChild(routes),
    ContentHeaderModule,
    PerfectScrollbarModule,
    CoreCommonModule,
    NgApexchartsModule,
    NgbModule,
    CoreSidebarModule,
  ],
  providers: [CardAdvanceService],
})
export class CardAdvanceModule {}
