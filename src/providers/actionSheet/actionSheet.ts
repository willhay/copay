import { ComponentRef, Injectable } from '@angular/core';
import { ActionSheetParent } from '../../components/action-sheet/action-sheet-parent';
import { InfoSheetComponent } from '../../components/info-sheet/info-sheet';
import { OptionsSheetComponent } from '../../components/options-sheet/options-sheet';
import { CreateComponentService } from '../../providers/createComponent/createComponent';

export type InfoSheetType = 'address-copied';
export type OptionsSheetType = 'address-options';

@Injectable()
export class ActionSheetProvider {
  constructor(public createComponent: CreateComponentService) {}

  public createOptionsSheet(
    type: OptionsSheetType,
    showShare: boolean
  ): OptionsSheetComponent {
    const sheet = this.setupSheet<OptionsSheetComponent>(
      OptionsSheetComponent,
      type
    );
    sheet.instance.showShare = showShare;
    return sheet.instance;
  }

  public createInfoSheet(type: InfoSheetType, params?): InfoSheetComponent {
    const sheet = this.setupSheet<InfoSheetComponent>(InfoSheetComponent, type);
    if (params) {
      sheet.instance.sheetTitle = params[0];
      sheet.instance.sheetText = params[1];
    }
    return sheet.instance;
  }

  private setupSheet<T extends ActionSheetParent<T>>(
    componentType: { new (): T },
    sheetType: string
  ): ComponentRef<T> {
    const sheet = this.createComponent.appendComponentToBody<T>(componentType);
    sheet.instance.componentRef = sheet;
    sheet.instance.sheetType = sheetType;

    return sheet;
  }
}
