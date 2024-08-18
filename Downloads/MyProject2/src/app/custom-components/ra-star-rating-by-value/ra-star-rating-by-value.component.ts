import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'ra-star-rating-by-value',
  templateUrl: './ra-star-rating-by-value.component.html',
  styleUrls: ['./ra-star-rating-by-value.component.scss'],
})
export class RaStarRatingByValueComponent implements OnInit {
  @Input() activeIcon = '';
  @Input() defaultIcon = 'fas fa-star';
  @Input() activeColor = '#FFD700';
  @Input() defaultColor = '#FFD700';
  @Input() readonly = false;
  @Input() odata = [];
  @Input() rating = '0';
  @Input() fontSize = '40px';
  @Output() ratingChanged = new EventEmitter();
  constructor() { }

  ngOnInit() {

 
   }



  // changed() {
  //   this.ratingChanged.emit(this.rating)
  // }

  setRating(val) {
    // console.log('this.readonly', this.readonly);
     console.log('this.index', val);
   
    if (!this.readonly) {
      this.rating = val;
      this.ratingChanged.emit(this.rating)
    }
  }

}
