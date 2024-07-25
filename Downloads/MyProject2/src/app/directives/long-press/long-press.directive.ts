import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements AfterViewInit {

 @Output() press = new EventEmitter();

  private active!: boolean;
  private action!: any;
  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController
  ) { }

  ngAfterViewInit(): void {
    this.initGesture(); // Corrected: Added parentheses to call the method
  }

  initGesture(): void {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      gestureName: 'long-press',
      threshold: 0,
      onStart: () => {
        this.active = true;
        this.longPressCheck();
      },
      onEnd: () => {
        this.active = false;
      },
    });
    gesture.enable();
  }

  longPressCheck() {
    // Clear any existing timeout to prevent multiple timers
    if (this.action) {
      clearTimeout(this.action);
    }

    // Set a new timeout
    this.action = setTimeout(() => {
      if(this.active){
        this.press.emit();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    // Clear the timeout when component is destroyed
    if (this.action) {
      clearTimeout(this.action);
    }
  }

}
