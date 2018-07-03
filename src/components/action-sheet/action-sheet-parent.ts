import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionSheetComponent } from './action-sheet';

export type dismissFunction = (data?: any) => void;
export class ActionSheetParent {
  public componentRef: any;
  public sheetType: string;
  public sheetTitle: string;
  public dismissFunction: dismissFunction;

  @ViewChild(ActionSheetComponent) actionSheet: ActionSheetComponent;

  public async present(): Promise<void> {
    this.actionSheet.showActionSheet = true;
    await Observable.timer(50).toPromise();
    this.actionSheet.showSlideEffect = true;
  }

  public async dismiss(): Promise<void> {
    await this.actionSheet.dismiss();
    // this.appRef.detachView(componentRef.hostView);
    this.componentRef.destroy();
  }

  public onDidDismiss(func: dismissFunction) {
    this.dismissFunction = func;
  }
}
