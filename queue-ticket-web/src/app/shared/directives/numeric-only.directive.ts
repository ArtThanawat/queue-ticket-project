import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]',
  standalone: true
})
export class NumericOnlyDirective {
  private readonly allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys
    if (this.allowedKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Allow Ctrl/Cmd combination (copy, paste, etc.)
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Check if it's a number
    const regExp = new RegExp('^[0-9]*$');
    if (!regExp.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    
    if (pastedText && !/^[0-9]*$/.test(pastedText)) {
      event.preventDefault();
    }
  }
}
