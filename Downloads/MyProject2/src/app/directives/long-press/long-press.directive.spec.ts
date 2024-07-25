import { ElementRef } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { LongPressDirective } from './long-press.directive';

describe('LongPressDirective', () => {
  it('should create an instance', () => {
    // Mock ElementRef and GestureController
    const mockElementRef = {} as ElementRef;
    const mockGestureController = {} as GestureController;

    // Instantiate LongPressDirective with mocked dependencies
    const directive = new LongPressDirective(mockElementRef, mockGestureController);

    expect(directive).toBeTruthy();
  });
});


