import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { ActionSheetParent } from '../action-sheet/action-sheet-parent';

@Component({
  selector: 'options-sheet',
  templateUrl: 'options-sheet.html'
})
export class OptionsSheetComponent extends ActionSheetParent {
  public sheetType: string;
  public showShare: boolean;
  public btnText: string;
  constructor(public events: Events) {
    super();
  }

  public optionClicked(option): void {
    this.events.publish('optionSelected', option);
    this.dismiss();
  }
}
