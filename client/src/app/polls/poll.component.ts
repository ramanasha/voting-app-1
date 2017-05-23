import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PollsService } from './polls.service';
import { Poll } from './poll';


@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styles: [`
    .indicator {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0%;
      height: 5px;
      opacity: .33;
      transition: all 0.5s ease;
    }
    .list-group-item:last-child .indicator {
        border-bottom-left-radius: 0.25rem;
    }
    .list-group-item:hover .indicator {
      opacity: 1;
    }
  `]
})
export class PollComponent implements OnInit {
  poll: Poll;
  error: string;
  id: string;
  loading: boolean;
  colors: string[] = ['#58e000', '#ffa073', '#970026', '#ff7300', '#096da4'];

  constructor(
    private pollsService: PollsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true;
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.loadPoll();
        }
      );
  }

  onClose() {
    this.router.navigate(['../'], {relativeTo: this.route, queryParamsHandling: 'merge'});
  }

  onVote(option: string) {
    this.loading = true;
    this.pollsService.vote(this.id, option)
      .then(poll => {
        this.poll = poll;
        this.loading = false;
      })
      .catch(error => this.showError(error))
  }

  private loadPoll() {
    this.pollsService.getPoll(this.id)
      .then(poll => {
        this.loading = false;
        this.poll = poll;
      })
      .catch(error => this.showError(error));
  }

  private showError(error: string) {
    this.error = error;
    this.loading = false;
    setTimeout(() => this.error = '', 5000);
  }
}
