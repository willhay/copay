import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, Events, NavController } from 'ionic-angular';
import { Logger } from '../../providers/logger/logger';

// Native
import { SocialSharing } from '@ionic-native/social-sharing';

// Pages
import { BackupWarningPage } from '../backup/backup-warning/backup-warning';
import { AmountPage } from '../send/amount/amount';
import { CopayersPage } from './../add/copayers/copayers';

// Providers
import { AddressProvider } from '../../providers/address/address';
import { BwcErrorProvider } from '../../providers/bwc-error/bwc-error';
import { ExternalLinkProvider } from '../../providers/external-link/external-link';
import { PlatformProvider } from '../../providers/platform/platform';
import { ProfileProvider } from '../../providers/profile/profile';
import { WalletProvider } from '../../providers/wallet/wallet';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { PopupProvider } from '../../providers/popup/popup';
import { WalletTabsChild } from '../wallet-tabs/wallet-tabs-child';
import { WalletTabsProvider } from '../wallet-tabs/wallet-tabs.provider';

@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html'
})
export class ReceivePage extends WalletTabsChild {
  public protocolHandler: string;
  public address: string;
  public qrAddress: string;
  public wallets = [];
  public wallet;
  public showShareButton: boolean;
  public loading: boolean;
  public isOpenSelector: boolean;
  public playAnimation: boolean;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    navCtrl: NavController,
    private logger: Logger,
    profileProvider: ProfileProvider,
    private walletProvider: WalletProvider,
    private platformProvider: PlatformProvider,
    private events: Events,
    private socialSharing: SocialSharing,
    private bwcErrorProvider: BwcErrorProvider,
    private translate: TranslateService,
    private externalLinkProvider: ExternalLinkProvider,
    private addressProvider: AddressProvider,
    private popupProvider: PopupProvider,
    walletTabsProvider: WalletTabsProvider
  ) {
    super(navCtrl, profileProvider, walletTabsProvider);
    this.showShareButton = this.platformProvider.isCordova;
  }

  ionViewDidLoad() {
    this.setAddress();
  }

  ionViewWillEnter() {
    this.playAnimation = false;
    this.isOpenSelector = false;
    this.events.subscribe('bwsEvent', (walletId, type) => {
      // Update current address
      if (this.wallet && walletId == this.wallet.id && type == 'NewIncomingTx')
        this.setAddress(true);
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('bwsEvent');
  }

  public requestSpecificAmount(): void {
    this.navCtrl.push(AmountPage, {
      toAddress: this.address,
      id: this.wallet.credentials.walletId,
      recipientType: 'wallet',
      name: this.wallet.name,
      color: this.wallet.color,
      coin: this.wallet.coin,
      nextPage: 'CustomAmountPage',
      network: this.addressProvider.validateAddress(this.address).network
    });
  }

  private async setAddress(
    newAddr?: boolean,
    changingWallet?: boolean
  ): Promise<void> {
    this.loading =
      newAddr || _.isEmpty(this.address) || changingWallet ? true : false;

    let addr: string = (await this.walletProvider
      .getAddress(this.wallet, newAddr)
      .catch(err => {
        this.loading = false;
        this.logger.warn(this.bwcErrorProvider.msg(err, 'Server Error'));
      })) as string;
    this.loading = false;
    if (addr != this.address) {
      let address = await this.walletProvider.getAddressView(this.wallet, addr);
      this.playAnimation = true;
      this.updateQrAddress();

      Observable.timer(400)
        .toPromise()
        .then(() => {
          this.address = address;
        });
    }
  }

  private async updateQrAddress(): Promise<void> {
    let qrAddress = await this.walletProvider.getProtoAddress(
      this.wallet,
      this.address
    );
    Observable.timer(400)
      .toPromise()
      .then(() => {
        this.qrAddress = qrAddress;
      });
    Observable.timer(600)
      .toPromise()
      .then(() => {
        this.playAnimation = false;
      });
  }

  public shareAddress(): void {
    if (!this.showShareButton) return;
    this.socialSharing.share(this.address);
  }

  public goCopayers(): void {
    this.navCtrl.push(CopayersPage, {
      walletId: this.wallet.credentials.walletId
    });
  }

  public goToBackup(): void {
    const backupWarningModal = this.popupProvider.createMiniModal(
      'backup-needed'
    );
    backupWarningModal.present({
      animate: false
    });
    backupWarningModal.onDidDismiss(goToBackupPage => {
      if (goToBackupPage)
        this.navCtrl.push(BackupWarningPage, {
          walletId: this.wallet.credentials.walletId
        });
    });
  }

  public openWikiBackupNeeded(): void {
    let url =
      'https://support.bitpay.com/hc/en-us/articles/115002989283-Why-don-t-I-have-an-online-account-for-my-BitPay-wallet-';
    let optIn = true;
    let title = null;
    let message = this.translate.instant('Read more in our Wiki');
    let okText = this.translate.instant('Open');
    let cancelText = this.translate.instant('Go Back');
    this.externalLinkProvider.open(
      url,
      optIn,
      title,
      message,
      okText,
      cancelText
    );
  }

  public showMoreOptions(): void {
    let buttons = [];

    let specificAmountButton = {
      text: this.translate.instant('Request Specific Amount'),
      handler: () => {
        this.requestSpecificAmount();
      }
    };
    let shareButton = {
      text: this.translate.instant('Share Address'),
      handler: () => {
        this.shareAddress();
      }
    };

    buttons.push(specificAmountButton);

    if (
      this.showShareButton &&
      this.wallet &&
      this.wallet.isComplete() &&
      !this.wallet.needsBackup
    )
      buttons.push(shareButton);

    const actionSheet = this.actionSheetCtrl.create({
      buttons
    });

    actionSheet.present();
  }

  public showFullAddr(): void {
    let buttons = [];

    let specificAmountButton = {
      text: this.address,
      cssClass: 'clipboard-actionsheet',
      handler: () => {
        console.log(1);
      }
    };

    buttons.push(specificAmountButton);

    const actionSheet = this.actionSheetCtrl.create({
      cssClass: 'clipboard-actionsheet',
      title: 'Copied BTC Address',
      buttons
    });

    actionSheet.present();
  }
}
