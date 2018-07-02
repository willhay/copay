import { ViewChild } from '@angular/core';
import { ActionSheetComponent } from './action-sheet';

export class ActionSheetParent {
  @ViewChild(ActionSheetComponent) actionSheet: ActionSheetComponent;

  public present(): void {
    this.actionSheet.showActionSheet = true;
    setTimeout(() => {
      this.actionSheet.showSlideEffect = true;
    }, 50);
  }

  public dismiss(): void {
    this.actionSheet.showSlideEffect = false;
    setTimeout(() => {
      this.actionSheet.showActionSheet = false;
    }, 150);
  }
}
