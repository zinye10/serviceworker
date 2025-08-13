import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Post } from './post/post';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SwPush } from '@angular/service-worker';

interface post {
  title: string;
  body: string;
  id: number;
  userId: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Post, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'serviceWorker';
  posts: post[] = [];

  constructor(private http: HttpClient, private swPush: SwPush) {}

  ngOnInit(): void {
    this.http
      .get<post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe((fetchedPosts) => (this.posts = fetchedPosts));

    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          this.swPush.notificationClicks.subscribe(
            ({ action, notification }) => {
              console.log('Notification clicked:', notification);
              // Handle navigation or other logic
            }
          );
        } else {
          console.warn('Notification permission denied.');
        }
      });
    }

    this.swPush.messages.subscribe((message: any) => {
      console.log('Push message received:', message);

      if (Notification.permission === 'granted') {
        console.log('hello');
        navigator.serviceWorker.startMessages();
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification(message.notification.title, {
              body: message.notification.body,
              icon: 'icons/icon-72x72.png',
              data: message.notification.data,
            });
          }
        });
      }
    });
  }
}
