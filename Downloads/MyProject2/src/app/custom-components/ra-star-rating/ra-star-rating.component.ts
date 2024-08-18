import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'ra-star-rating',
  templateUrl: './ra-star-rating.component.html',
  styleUrls: ['./ra-star-rating.component.scss'],
})
export class RaStarRatingComponent implements OnInit {
  @Input() activeIcon = '';
  @Input() defaultIcon = 'fas fa-star';
  @Input() activeColor = '#FFD700';
  @Input() defaultColor = '#FFD700';
  @Input() readonly = false;
  @Input() maxRating = '5';
  @Input() rating = '0';
  @Input() fontSize = '40px';
  @Output() ratingChanged = new EventEmitter();
  constructor() { }

  ngOnInit() {

 
   }



  // changed() {
  //   this.ratingChanged.emit(this.rating)
  // }

  setRating(index: string) {
    // console.log('this.readonly', this.readonly);
    // console.log('this.index', index);
   
    if (!this.readonly) {
      this.rating = index + 1
      this.ratingChanged.emit(this.rating)
    }
  }

}
