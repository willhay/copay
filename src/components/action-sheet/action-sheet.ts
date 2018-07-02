import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'action-sheet',
  templateUrl: 'action-sheet.html'
})
export class ActionSheetComponent {
  public showActionSheet: boolean;
  @HostBinding('class.open') public showSlideEffect: boolean;

  constructor() {
    this.showActionSheet = false;
    this.showSlideEffect = false;
  }

  public dismiss(): void {
    this.showSlideEffect = false;
    setTimeout(() => {
      this.showActionSheet = false;
    }, 150);
  }
}
