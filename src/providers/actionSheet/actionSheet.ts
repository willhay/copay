import { Injectable } from '@angular/core';
import { InfoSheetComponent } from '../../components/info-sheet/info-sheet';
import { OptionsSheetComponent } from '../../components/options-sheet/options-sheet';
import { CreateComponentService } from '../../providers/createComponent/createComponent';

export type InfoSheetType = 'address-copied';
export type OptionsSheetType = 'address-options';

@Injectable()
export class ActionSheetProvider {
  constructor(public createComponent: CreateComponentService) {}

  public createInfoSheet(type: InfoSheetType, params?): InfoSheetComponent {
    const sheet = this.createComponent.appendComponentToBody(InfoSheetComponent)
      .instance;
    sheet.sheetType = type;
    if (params) {
      sheet.sheetTitle = params[0];
      sheet.sheetText = params[1];
    }
    return sheet;
  }

  public createOptionsSheet(
    type: OptionsSheetType,
    showShare: boolean
  ): OptionsSheetComponent {
    const sheet = this.createComponent.appendComponentToBody(
      OptionsSheetComponent
    ).instance;
    sheet.sheetType = type;
    sheet.showShare = showShare;
    return sheet;
  }
}
