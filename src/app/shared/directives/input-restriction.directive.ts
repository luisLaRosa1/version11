import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[InputRestriction]'
})
export class InputRestrictionDirective {

  @Input('InputRestriction') InputRestriction!: string;

  constructor(
    private element: ElementRef,
    private readonly control: NgControl,
    private renderer: Renderer2,
  ) {

  }

  @HostListener('keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent) {


    var reestriction = this.InputRestriction.toUpperCase();
    switch (reestriction) {
      case 'UPPERCASE':
        var regex = new RegExp('[0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]');
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
        break;
      case 'NAMES':
        var regex = new RegExp('[0-9a-zA-ZñÑ.áéíóúÁÉÍÓÚ ]');
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
        break;
      case 'NUMBERS':
        var regex = new RegExp('[0-9]');
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
        break;
      case 'DATE':
        var regex = new RegExp('[0-9/]');
        var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (regex.test(str)) {
          return true;
        }
        break;
    }

    event.preventDefault();
    return false;
  }

  @HostListener('blur')
  onBlur() {
    let valuefield = (this.element.nativeElement as HTMLInputElement).value;
    var reestriction = this.InputRestriction.toUpperCase();

    switch (reestriction) {
      case 'UPPERCASE':
        valuefield = valuefield.toUpperCase().replace(/ +/g, ' ');
        break;
      case 'NAMES':
        let words = valuefield.split(" ");

        for (let i = 0; i < words.length; i++) {
          words[i] = words[i].trim()

          if (words[i].length > 0) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
          }
        }
        valuefield = words.join(" ").replace(/ +/g, ' ');
        break;
      case 'NUMBERS':
        valuefield = valuefield.replace(/ +/g, '');
        break;

    }

    this.control.control?.setValue(valuefield.trim());
  }
}
