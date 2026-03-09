import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {

  @Input() appHighlight: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit(): void {

    if (this.appHighlight === 'IMAX' || this.appHighlight === '4DX') {

      this.el.nativeElement.style.border = '2px solid gold';
      this.el.nativeElement.style.boxShadow = '0 0 10px rgba(255,215,0,0.7)';

    }

  }

}