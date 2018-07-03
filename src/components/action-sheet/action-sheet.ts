import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { DomProvider } from '../../providers/dom/dom';

@Component({
  selector: 'action-sheet',
  templateUrl: 'action-sheet.html'
})
export class ActionSheetComponent {
  private parentComponentRef: any;
  public showActionSheet: boolean = false;
  @HostBinding('class.open') public showSlideEffect: boolean = false;

  constructor(private domProvider: DomProvider) {}

  public async present(componentRef: any) {
    this.parentComponentRef = componentRef;
    this.showActionSheet = true;
    await Observable.timer(50).toPromise();
    this.showSlideEffect = true;
  }

  public async dismiss(): Promise<void> {
    this.showSlideEffect = false;
    return Observable.timer(400)
      .toPromise()
      .then(() => {
        this.showActionSheet = false;
        this.domProvider.removeComponent(this.parentComponentRef);
      });
  }
}
