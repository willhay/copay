import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector
} from '@angular/core';

export type InfoSheetType = 'confirm' | 'warning';

@Injectable()
export class CreateComponentService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  public appendComponentToBody<T>(component: { new (): T }): ComponentRef<T> {
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory<T>(component)
      .create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<T>)
      .rootNodes[0] as HTMLElement;
    document.getElementsByTagName('ion-app')[0].appendChild(domElem);
    return componentRef;
  }
}
