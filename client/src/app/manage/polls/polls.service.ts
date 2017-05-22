import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { Poll } from './poll';

@Injectable()
export class PollsService {
  pollsChanged = new Subject<string>();
  apiUrl: string = environment.apiRootUrl;

  constructor(
    private authHttp: AuthHttp) { }

  getPolls(page: number = 1) {
    return this.authHttp.get(`${this.apiUrl}/manage/polls?page=${page}`)
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.handleError);
  }

  getPoll(id: string) {
    return this.authHttp.get(`${this.apiUrl}/manage/polls/${id}`)
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        return data;
      })
      .catch(this.handleError);
  }

  updatePoll(id: string, poll: Poll) {
    const body = { title: poll.title, options: poll.options.map(option => option.title) };
    return this.authHttp.put(`${this.apiUrl}/manage/polls/${id}`, body)
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        this.pollsChanged.next(`"${data.title}" poll was successfully updated!`);
        return data;
      })
      .catch(this.handleError);
  }

  createPoll(poll: Poll) {
    const body = { title: poll.title, options: poll.options.map(option => option.title) };
    return this.authHttp.post(`${this.apiUrl}/manage/polls`, body)
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        this.pollsChanged.next(`"${data.title}" poll was successfully saved!`);
        return data;
      })
      .catch(this.handleError);
  }

  deletePoll(id: string) {
    return this.authHttp.delete(`${this.apiUrl}/manage/polls/${id}`)
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        this.pollsChanged.next(`"${data.title}" poll was successfully deleted!`);
        return data;
      })
      .catch(this.handleError);
  }

  private handleError(err: any): Promise<any> {
    if(err instanceof Response) {
      const { error } = err.json();
      return Promise.reject(error.message || error);
    }
    return Promise.reject(err.message || err);
  }

}
