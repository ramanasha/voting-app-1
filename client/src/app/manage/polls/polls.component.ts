import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { PollsService } from './polls.service'
import { Poll } from './poll';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit {
  polls: Poll[] = [];
  pagination: any;
  subscription: Subscription;
  timeoutID: any;
  msg: string;
  constructor(private pollsService: PollsService) { }

  ngOnInit() {
    this.getPolls();

    this.subscription = this.pollsService.pollsChanged
      .subscribe(
        ((msg: string) => {
          this.showMsg(msg);
          this.getPolls();
        })
      )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  closeMsg() {
    if(this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.msg = '';
  }

  onPageChange(page: number) {
    this.getPolls(page);
  }

  private getPolls(page: number  = 1) {
    this.pollsService.getPolls(page)
      .then((res) => {
        this.polls = res.data;
        this.pagination = res.pagination;
      })
      .catch((error) => this.showMsg(error));
  }

  private showMsg(msg: string) {
    this.msg = msg;
    if(this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
    this.timeoutID = setTimeout(() => this.msg = '', 5000);
  }

}
