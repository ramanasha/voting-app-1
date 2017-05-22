import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PollsService } from './polls.service';
import { Poll } from './poll';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.css']
})
export class PollsComponent implements OnInit, OnDestroy {
  polls: Poll[];
  pagination;
  subscription: Subscription;

  constructor(
    private pollsService: PollsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadPolls();
    this.subscription = this.pollsService.pollsChanged
      .subscribe(
        ((msg: string) => {

          this.loadPolls();
        })
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadPolls() {
    this.pollsService.getPolls()
      .then((res) => {
        this.polls = res.data;
        this.pagination = res.pagination;
      });
  }

  onNavigate(id: string) {
    this.router.navigate([id], {relativeTo: this.route});
  }

  onPageChange(page: number) {
    this.pollsService.getPolls(page)
      .then((res) => {
        this.polls = res.data;
        this.pagination = res.pagination;
      })
  }

}
