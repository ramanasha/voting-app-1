import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class PollsService {
  apiUrl: string = environment.apiRootUrl;
  pollsChanged = new Subject<string>();

  constructor(private http: Http) { }

  getPolls(page: number = 1) {
    return this.http.get(`${this.apiUrl}/polls?page=${page}`)
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.handleError);
  }

  getPoll(id: string) {
    return this.http.get(`${this.apiUrl}/polls/${id}`)
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        return data;
      })
      .catch(this.handleError);
  }

  vote(pollId: string, optionId: string) {
    return this.http.get(`${this.apiUrl}/polls/${pollId}/vote/${optionId}`)
      .toPromise()
      .then((response: Response) => {
        this.pollsChanged.next(`Your vote has been successfully cast!`);
        return response.json().data;
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
