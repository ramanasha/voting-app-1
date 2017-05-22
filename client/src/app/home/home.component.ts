import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PollsService } from '../polls/polls.service';
import { Poll } from '../polls/poll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  polls: Poll[];
  constructor(
    private pollsService: PollsService,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.pollsService.getPolls()
      .then((res) => this.polls = res.data)
  }

  loggedIn() {
    return this.auth.isAuthenticated();
  }

  onNavigate(pollId: string) {
    this.router.navigate(['/polls', pollId])
  }
}
