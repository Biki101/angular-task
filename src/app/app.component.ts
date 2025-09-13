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
  errorMessage: string = '';

  constructor(private apiService: UserService) {}

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.apiService.getUserList().subscribe({
      next: (res) => {
        this.userList = res;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user list. Please try again later.';
      },
    });
  }
}
