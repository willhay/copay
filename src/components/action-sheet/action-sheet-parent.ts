import { ViewChild } from '@angular/core';
import { ActionSheetComponent } from './action-sheet';

export type dismissFunction = (data?: any) => void;
export class ActionSheetParent {
  public componentRef: any;
  public sheetType: string;
  public sheetTitle: string;
  public dismissFunction: dismissFunction;

  @ViewChild(ActionSheetComponent) actionSheet: ActionSheetComponent;

  public async present(): Promise<void> {
    return this.actionSheet.present(this.componentRef);
  }

  public async dismiss(): Promise<void> {
    console.log('calling dismiss');
    await this.actionSheet.dismiss();
    console.log('calling remove component');
  }

  public onDidDismiss(func: dismissFunction) {
    this.dismissFunction = func;
  }
}
