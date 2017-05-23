import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms'
import { PollsService } from '../polls.service';
import { Poll } from '../poll';
import { PollOption } from '../poll-option';

@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css']
})
export class PollEditComponent implements OnInit {
  poll: Poll;
  pollForm: FormGroup;
  editMode: boolean = false;
  error: string;
  id: string;
  colors: string[] = ['#58e000', '#ffa073', '#970026', '#ff7300', '#096da4'];

  constructor(
    private pollsService: PollsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    const options = this.pollForm.value.options.map((option: any) => new PollOption(option.title));
    const title: string = this.pollForm.value.title;
    const newPoll = { title, options };

    if(this.editMode) {
      this.updatePoll(newPoll);
    } else {
      this.createPoll(newPoll);
    }
  }

  onAddPollOption() {
    (<FormArray>this.pollForm.get('options')).push(
      new FormGroup({
        'title': new FormControl(null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50)
        ])
      })
    );
  }

  onDeletePollOption(index: number) {
    (<FormArray>this.pollForm.get('options')).removeAt(index);
  }

  onClose() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  optionControls() {
    return (<FormArray>this.pollForm.get('options')).controls;
  }

  private initForm() {
    this.pollForm = new FormGroup({
      'title': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      'options': new FormArray([])
    });

    if(this.editMode) {
      this.pollsService.getPoll(this.id)
        .then((poll) => {
          this.poll = poll;
          this.pollForm.patchValue({ 'title': this.poll.title });
        })
        .catch((error) => this.error = error)
    }
  }

  private updatePoll(newPoll: Poll) {
    this.pollsService.updatePoll(this.id, newPoll)
      .then((data) => this.onClose())
      .catch((error) => this.error = error)
  }

  private createPoll(newPoll: Poll) {
    this.pollsService.createPoll(newPoll)
      .then((data) => this.onClose())
      .catch((error) => this.error = error)
  }

  private showError(error: string) {
    this.error = error;
    setTimeout(() => this.error = '', 5000);
  }
}
