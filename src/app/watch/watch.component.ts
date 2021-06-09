import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentTime } from '../models/current-time.model';
import { TimeItem } from '../models/time-item.model';
import { WatchService } from './watch.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit, OnDestroy {
  public time: CurrentTime
  public timeToDisplay: any
  public interval: any
  public isRunning = false
  public currentTimeList: TimeItem[] = []
  startTime: any;

  constructor(private watchService: WatchService) {
    watchService.serviceTimeList$.subscribe(res => {
      this.currentTimeList = res;
    })

    watchService.serviceCurrentTime$.subscribe((res) => {
      this.time = res;
    })
  }

  ngOnDestroy(): void {
    this.pauseTimer()
  }

  ngOnInit(): void {
    this.initTime()
  }

  public initTime() {
    let timeList = JSON.parse(localStorage.getItem('time_list'));
    if (!!timeList) {
      this.watchService.setTimeList(timeList)
    }
    let timeFromLS = JSON.parse(localStorage.getItem('current_time'));
    if (!!timeFromLS) {
      this.watchService.setCurrentTime(timeFromLS)
    }
  }

  public startTimer() {
    this.isRunning = true;
    this.startTime = Date.now() - this.time.elapsedTime;
    this.interval = setInterval(() => {
      this.time.elapsedTime = Date.now() - this.startTime;
      this.timeToDisplay = this.timeAsString(this.time.elapsedTime)
    }, 10)
  }

  public pauseTimer() {
    clearInterval(this.interval);
    this.isRunning = false;
  }

  get getSecond() {
    return this.time.ms;
  }
  get getMinute() {
    return this.time.ss;
  }
  get getHour() {
    return this.time.mm
  }

  timeAsString(time: any) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    this.time.mm = mm.toString().padStart(2, "0");
    this.time.ss = ss.toString().padStart(2, "0");
    this.time.ms = ms.toString().padStart(2, "0");
    this.watchService.setCurrentTime(this.time)
  }


  public clearAll() {
    this.pauseTimer()
    this.watchService.clearAll()
    this.watchService.setTimeList([])
  }

  public saveCurrentTime() {
    let time = `${this.time.mm}:${this.time.ss}:${this.time.ms}`
    let showButton = false
    let index = this.getIndex({ time, showButton })
    if (index == -1) {
      this.currentTimeList.push({ time, showButton })
      this.watchService.setTimeList(this.currentTimeList)
    }
  }

  public deleteTimeFromList(item: TimeItem) {
    let index = this.getIndex(item)
    if (index !== -1) {
      this.currentTimeList.splice(index, 1);
      this.watchService.setTimeList(this.currentTimeList)
    }
  }

  public getIndex(item: TimeItem) {
    return this.currentTimeList.findIndex((el) => {
      return item.time === el.time;
    })
  }

  public showHideElement(item: TimeItem, bool: boolean) {
    item.showButton = bool;
  }
}