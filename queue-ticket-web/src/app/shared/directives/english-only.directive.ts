import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnglishOnly]',
  standalone: true
})
export class EnglishOnlyDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Allow only A-Z, a-z, 0-9 and space. Remove others (like Thai characters).
    const filteredValue = input.value.replace(/[^A-Za-z0-9 ]/g, '');

    if (filteredValue !== input.value) {
      input.value = filteredValue;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');

    if (pastedText && /[^A-Za-z0-9 ]/g.test(pastedText)) {
      event.preventDefault();
      const filteredText = pastedText.replace(/[^A-Za-z0-9 ]/g, '');
      const input = event.target as HTMLInputElement;

      // Insert filtered text at cursor position
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const text = input.value;
      input.value = text.slice(0, start) + filteredText + text.slice(end);

      // Trigger input event to update ngModel/FormControl
      input.dispatchEvent(new Event('input'));
    }
  }
}
