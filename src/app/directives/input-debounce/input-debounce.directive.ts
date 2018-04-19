import {Directive, Input, Output, ElementRef, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Directive({
  selector: '[inputDebounce]'
})

export class InputDebounceDirective {
    @Input() placeholder: string;
    @Input() delay: number = 300;
    @Output() outputValue: any = new EventEmitter();

    public inputValue: string;

    constructor(private elementRef: ElementRef) {

        const eventStream = Observable.fromEvent(elementRef.nativeElement, 'keyup')
            .map(() => elementRef.nativeElement.value)
            .debounceTime(this.delay)
            .distinctUntilChanged();

        eventStream.subscribe(input => this.outputValue.emit(input));
    }
}