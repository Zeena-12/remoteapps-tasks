import { Directive, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective implements OnInit, OnDestroy {

  @Input() duration = 100;
  @Output() longPress = new EventEmitter<void>();

  private sub!: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');
    const mouseUp$ = fromEvent(this.el.nativeElement, 'mouseup');
    this.sub = mouseDown$
      .pipe(
        switchMap(() => timer(this.duration).pipe(takeUntil(mouseUp$)))
      )
      .subscribe(() => this.longPress.emit());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
