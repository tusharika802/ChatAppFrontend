import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../enviornment/dev.env';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule]
})
export class FeedbackComponent {
  @Input() userId!: string;
  @Input() room!: string;
  @Output() feedbackClosed = new EventEmitter<void>();

  issue = '';
  http = inject(HttpClient)
  constructor() { /* empty */ }

 submitFeedback() {

  if (!this.issue.trim()) return;
    this.http.post<{ message?: string }>(`${environment.apiUrl}/feedback`, {
      userId: this.userId,
      room: this.room,
      issue: this.issue
    }).subscribe({
      next: res => {
        alert(res.message || 'Feedback sent successfully!');
        this.issue = '';
        this.close(); 
      },
      error: err => {
        console.error(err);
        alert('Failed to send feedback!'); 
      }
    });
  }

  close() {
    this.feedbackClosed.emit();
  }
}
