import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription',
  imports: [],
  template:''
})
export class SubscriptionComponent implements OnDestroy{
  subscription? = new Observable<unknown>();
  
  ngOnDestroy(): void {
    this.subscription?.subscribe();
  }

}
