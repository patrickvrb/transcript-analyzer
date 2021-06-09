import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { CoreModule } from "src/app/core/core.module";
import { MaterialModule } from "../../material/material.module";

import AnalyzerComponent from "./analyzer.component";
import { ROUTES } from "./analyzer.routes";

@NgModule({
  declarations: [AnalyzerComponent],
  imports: [
    CoreModule,
    FormsModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
})
export class AnalyzerModule {}
