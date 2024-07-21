// long-press.directive.ts
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<void>();
  private longPressTimeout: any;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: MouseEvent | TouchEvent) {
    this.longPressTimeout = setTimeout(() => {
      console.log('Long press detected');
      this.longPress.emit();
    }, 1000); // Adjust 1000ms (1 second) as needed for your long press duration
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  onMouseUp() {
    clearTimeout(this.longPressTimeout);
  }
}
