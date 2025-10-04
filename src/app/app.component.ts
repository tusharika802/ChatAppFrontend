import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Router, RouterOutlet } from '@angular/router';
import { ChatMessage } from './chat-message';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],  
     template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  screen: 'home' | 'create' | 'join' | 'chat' = 'home';
  userId = '';
  room = '';

  chatService = inject(ChatService);
  router = inject(Router);
  ngOnInit(): void {
  this.chatService.messages$.subscribe((msg: ChatMessage) => {
      if (msg.action === 'roomCreated' && msg.room) {
        this.room = msg.room;
      }
    });
}
  constructor(){ /* empty */} 
  

  handleHomeAction(e: { type: 'create' | 'join', userId: string }) {
    this.userId = e.userId;
    if (e.type === 'create') {
      this.screen = 'create';
      this.chatService.connect('create', this.userId);
    } else {
      this.screen = 'join';
    }
  }

  handleJoin(room: string) {
    this.room = room;
    this.chatService.connect('join', this.userId, this.room);
    this.screen = 'chat';
  }

  handleStartChat() {
    this.screen = 'chat';
  }
   

}
