import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Post } from './post/post';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<post[]>('https://jsonplaceholder.typicode.com/posts')
      .subscribe((fetchedPosts) => (this.posts = fetchedPosts));
  }
}
