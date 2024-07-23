import { Directive, ElementRef, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<void>();
  private pressTimer: any;
  private readonly PRESS_DURATION = 500; // Adjust duration as needed

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPressStart(event: MouseEvent | TouchEvent) {
    this.pressTimer = setTimeout(() => {
      this.longPress.emit();
    }, this.PRESS_DURATION);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onPressEnd() {
    clearTimeout(this.pressTimer);
  }
}
