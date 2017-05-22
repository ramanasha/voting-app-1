import { PollOption } from './poll-option';

export class Poll {
  public title: string;
  public options: PollOption[] = [];
  public votes?: number;

  constructor(title: string, options: PollOption[], votes?: number) {
    this.title = title;
    this.options = options;
    if(this.votes) {
      this.votes = votes;
    }
  }
}
