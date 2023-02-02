import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHidden]' })
export class HiddenDirective {
    constructor(el: ElementRef, renderer: Renderer2) {
     // Use renderer to render the element with styles
       renderer.setStyle(el.nativeElement, 'display', 'none');
    }
}
