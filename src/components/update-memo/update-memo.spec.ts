import { async, ComponentFixture } from '@angular/core/testing';

import { TestUtils } from '../../test';

import { UpdateMemoComponent } from './update-memo';

describe('UpdateMemoComponent', () => {
  let fixture: ComponentFixture<UpdateMemoComponent>;
  let instance: any;

  beforeEach(async(() =>
    TestUtils.configurePageTestingModule([UpdateMemoComponent]).then(
      testEnv => {
        fixture = testEnv.fixture;
        instance = testEnv.instance;
        fixture.detectChanges();
      }
    )));
  afterEach(() => {
    fixture.destroy();
  });

  describe('Methods', () => {
    describe('#toggleMemoUpdate', () => {
      it('should emit confirmPageHideSlider true if isCordova', async () => {
        instance.isCordova = true;
        spyOn(instance.confirmPageHideSlider, 'emit');
        instance.toggleMemoUpdate();
        expect(instance.confirmPageHideSlider.emit).toHaveBeenCalledWith(true);
      });
      it('should set doUpdateMemoInfo to true', async () => {
        instance.doUpdateMemoInfo = false;
        instance.toggleMemoUpdate();
        expect(instance.doUpdateMemoInfo).toEqual(true);
      });
    });
    describe('#saveMemoNow', () => {
      it('should set doUpdateMemoInfo to false and emit memo', async () => {
        instance.doUpdateMemoInfo = true;
        instance.value = 'sample memo';
        spyOn(instance.memoUpdated, 'emit');
        instance.saveMemoNow();
        expect(instance.doUpdateMemoInfo).toEqual(false);
        expect(instance.memoUpdated.emit).toHaveBeenCalledWith('sample memo');
      });
      it('should emit confirmPageHideSlider false if isCordova', async () => {
        instance.isCordova = true;
        spyOn(instance.confirmPageHideSlider, 'emit');
        instance.saveMemoNow();
        expect(instance.confirmPageHideSlider.emit).toHaveBeenCalledWith(false);
      });
    });
  });
});
