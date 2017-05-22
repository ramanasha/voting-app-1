export class PollOption {
  public title: string;
  public id: string;
  public votes: number;
}
export class Poll {
  public title: string;
  public options: PollOption[];
  public votes: number;
  public id: string;
  public user: string;
}
