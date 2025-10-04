import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { RouterModule } from '@angular/router';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatBarComponent } from './components/chat-components/chat-bar/chat-bar.component';
import { FeedbackComponent } from './components/feedback/feedback.component';


@NgModule({
  declarations: [
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    PickerModule,
    EmojiModule,
    ChatBarComponent,
    JoinRoomComponent,CreateRoomComponent,HomeComponent,FeedbackComponent

  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
