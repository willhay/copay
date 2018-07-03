import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

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

  public async dismiss(): Promise<void> {
    this.showSlideEffect = false;
    return Observable.timer(400)
      .toPromise()
      .then(() => {
        this.showActionSheet = false;
      });
  }
}
