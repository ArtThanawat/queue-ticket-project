import { Component, input } from '@angular/core';

@Component({
  selector: 'app-queue-frame',
  templateUrl: './queue-frame.html'
})
export class QueueFrame {
  readonly code = input.required<string>();
}
