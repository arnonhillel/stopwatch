import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { CurrentTime } from '../models/current-time.model';
import { TimeItem } from '../models/time-item.model';

@Injectable({
  providedIn: 'root'
})
export class WatchService {
  public timeInit: CurrentTime = {
    mm:'00',
    ss:'00',
    ms:'00',
    elapsedTime:0
  }
  private timeList = new BehaviorSubject<TimeItem[]>([]);
  serviceTimeList$ = this.timeList.asObservable();
  
  private currentTime = new BehaviorSubject<CurrentTime>(this.timeInit);
  serviceCurrentTime$ = this.currentTime.asObservable();


  constructor() { }


  public setTimeList(timeList: TimeItem[]) {
    this.timeList.next(timeList)
    localStorage.setItem('time_list', JSON.stringify(timeList));
  }

  public setCurrentTime(time:CurrentTime) {
    this.currentTime.next(time)
    localStorage.setItem('current_time', JSON.stringify(time));
  }

  public clearAll(){
    this.setCurrentTime(this.timeInit)
  }

}
