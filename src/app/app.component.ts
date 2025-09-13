import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = false;
  userList: any[] = [];
  pagedList: any[] = [];
  errorMessage: string = '';
  page = 1;
  pageSize = 5;

  constructor(private apiService: UserService) {}

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.apiService.getUserList().subscribe({
      next: (res) => {
        this.userList = res;
        this.pagedItems();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user list. Please try again later.';
      },
    });
  }

  pagedItems() {
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    this.pagedList = this.userList.slice(start, end);
  }

  onPageChange(event: number) {
    this.page = event;
    this.pagedItems();
  }
}
