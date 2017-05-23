import { Directive, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMenuToggler]'
})
export class MenuTogglerDirective {
  @HostBinding('class.show') isOpen = false;

  constructor(private elRef: ElementRef) {}

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    if(!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

}
