import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms'
import { PollsService } from '../polls.service';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-poll-delete',
  templateUrl: './poll-delete.component.html',
  styleUrls: ['./poll-delete.component.css']
})
export class PollDeleteComponent implements OnInit {
  poll: Poll;
  pollForm: FormGroup;
  error: string;
  id: string;

  constructor(
    private pollsService: PollsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.pollForm = new FormGroup({});
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.pollsService.getPoll(this.id)
            .then((poll) => {
              this.poll = poll;
            })
            .catch((error) => this.error = error)
        }
      );
  }

  onSubmit() {
    this.pollsService.deletePoll(this.id)
      .then((data) => this.onClose())
      .catch((error) => this.error = error)
  }

  onClose() {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  private showError(error: string) {
    this.error = error;
    setTimeout(() => this.error = '', 5000);
  }
}
