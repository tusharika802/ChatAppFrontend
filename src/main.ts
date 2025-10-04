import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ChatComponent } from './app/components/chat-components/chat/chat.component';
import { CreateRoomComponent } from './app/components/create-room/create-room.component';
import { HomeComponent } from './app/components/home/home.component';
import { JoinRoomComponent } from './app/components/join-room/join-room.component';
import { AppComponent } from './app/app.component';

const routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateRoomComponent },
  { path: 'join', component: JoinRoomComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: 'home' }
];
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});