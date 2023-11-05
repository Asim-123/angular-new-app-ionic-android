import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  userPosts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  likedPosts: string[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.fetchNews();
  }

  async fetchNews() {
    const apiKey = 'df6c6462da8f470a9c350b441b65f3fa';
    const apiUrl = `https://newsapi.org/v2/everything?q=tesla&from=2023-10-04&sortBy=publishedAt&apiKey=${apiKey}`;

    try {
      this.httpClient.get(apiUrl).subscribe((response: any) => {
        if (response.articles) {
          this.userPosts = response.articles;
          this.filteredPosts = this.userPosts;
        }
      });
    } catch (error) {
      console.error('Error fetching news: ', error);
    }
  }

  searchPosts() {
    this.filteredPosts = this.userPosts.filter((post: any) =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async likePost(post: any) {
    // Implement your like functionality if needed.
  }
}
