import { Component } from '@angular/core';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';

export type dismissFunction = (data?: any) => void;
@Component({
  selector: 'options-sheet',
  templateUrl: 'options-sheet.html'
})
export class OptionsSheetComponent extends ActionSheetParent<
  OptionsSheetComponent
> {
  public sheetType: string;
  public showShare: boolean;
  public btnText: string;
  public dismissFunction: dismissFunction;
  constructor() {
    super();
  }

  public onDidDismiss(func: dismissFunction) {
    this.dismissFunction = func;
  }

  public optionClicked(option): void {
    this.dismissFunction && this.dismissFunction(option);
    this.dismiss();
  }
}
