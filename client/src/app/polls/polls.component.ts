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
  pagination: any;
  page: number;
  subscription: Subscription;
  loading: boolean;

  constructor(
    private pollsService: PollsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          this.startLoader();
          this.loadPolls(params['page']);
          this.page = params['page'];
        }
      );

    this.subscription = this.pollsService.pollsChanged
      .subscribe(
        ((msg: string) => {
          this.startLoader();
          this.loadPolls(this.page);
        })
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNavigate(id: string) {
    this.router.navigate([id], {relativeTo: this.route, queryParamsHandling: 'merge'});
  }

  onPageChange(page: number) {
    this.router.navigate(['/polls'], {queryParams: {page: page}});
  }

  private startLoader() {
    this.loading = true;
  }

  private endLoader() {
    this.loading = false;
  }

  private loadPolls(page: number = 1) {
    this.pollsService.getPolls(page)
      .then((res) => {
        this.polls = res.data;
        this.pagination = res.pagination;
        this.endLoader();
      });
  }

}
