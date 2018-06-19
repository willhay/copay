import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

// Providers
import { PlatformProvider } from '../../providers/platform/platform';
import { ProfileProvider } from '../../providers/profile/profile';

@Component({
  selector: 'update-memo',
  templateUrl: 'update-memo.html'
})
export class UpdateMemoComponent {
  private doUpdateMemoInfo: boolean;
  public textInput = new FormControl('');
  public updatingMemo: boolean;
  public btx;
  public wallet;
  private isCordova: boolean;
  @ViewChild('focusMe') myInput;
  @ViewChild('focusMe', { read: ElementRef })
  moveCaret: ElementRef;
  @Output() memoUpdated: EventEmitter<any> = new EventEmitter();
  @Output() confirmPageHideSlider: EventEmitter<any> = new EventEmitter();
  @Input() value;

  constructor(
    private profileProvider: ProfileProvider,
    private navParams: NavParams,
    private platformProvider: PlatformProvider
  ) {
    this.isCordova = this.platformProvider.isCordova;

    this.textInput.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(value => {
        this.value = value;
        this.updatingMemo = true;
        this.memoUpdated.emit(value);
        Observable.timer(2000)
          .toPromise()
          .then(() => {
            this.updatingMemo = false;
          });
      });

    this.updatingMemo = false;
    this.doUpdateMemoInfo = false;
    this.wallet = this.profileProvider.getWallet(
      this.navParams.get('walletId')
    );
  }

  public saveMemoNow(): void {
    this.doUpdateMemoInfo = false;
    if (this.isCordova) {
      this.confirmPageHideSlider.emit(false);
    }
    this.memoUpdated.emit(this.value);
  }

  public async toggleMemoUpdate(): Promise<void> {
    if (this.isCordova) {
      this.confirmPageHideSlider.emit(true);
    }
    if (!this.doUpdateMemoInfo) {
      this.doUpdateMemoInfo = true;
      await Observable.timer(150).toPromise();
      if (this.myInput) {
        this.myInput.setFocus();
      }
      if (this.moveCaret) {
        const elem = this.moveCaret.nativeElement.getElementsByTagName(
          'textarea'
        )[0];
        if (this.value) {
          elem.setSelectionRange(this.value.length, this.value.length);
        }
      }
    }
  }
}
