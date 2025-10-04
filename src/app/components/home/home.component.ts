import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class HomeComponent implements OnInit {
  userId = '';
  router = inject(Router);
  constructor() { /* empty */ }
  ngOnInit(): void {
    if (!localStorage.getItem("token")) {
      this.router.navigate(['/']);
    }
  }

  create() {
    if (!this.userId.trim()) {
      alert('Enter your name!');
      return;
    }
    this.router.navigate(['/create'], { state: { userId: this.userId } });
  }

  join() {
    if (!this.userId.trim()) {
      alert('Enter your name!');
      return;
    }
    this.router.navigate(['/join'], { state: { userId: this.userId } });
  }
}
