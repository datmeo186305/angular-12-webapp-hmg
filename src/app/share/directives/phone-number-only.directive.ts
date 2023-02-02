import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[appPhoneNumberOnly]'
})
export class PhoneNumberOnlyDirective {

  constructor(el: ElementRef, renderer: Renderer2) {
    // Use renderer to render the element with styles
    el.nativeElement.addEventListener("keyup", () => {
      let regex = /^[+0-9]*$/;
      if (!regex.test(el.nativeElement.value)) {
        el.nativeElement.value = el.nativeElement.value.slice(0, -1);
      }
    });
  }

}
