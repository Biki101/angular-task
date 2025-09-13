import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoading = false;
  userList: any[] = [];
  pagedList: any[] = [];
  filteredUserList: any[] = [];
  errorMessage: string = '';
  page = 1;
  pageSize = 5;
  searchQuery = '';

  constructor(
    private apiService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this.isLoading = true;
    this.apiService.getUserList().subscribe({
      next: (res) => {
        this.userList = res;
        this.filteredUserList = this.userList;
        this.pagedItems();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Failed to load user list. Please try again later. Error: ${err?.message}`;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  filterUserList() {
    if (this.searchQuery?.trim() === '') {
      this.filteredUserList = this.userList;
    } else {
      this.filteredUserList = this.userList.filter(
        (user) =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { search: this.searchQuery },
      queryParamsHandling: 'merge',
    });

    this.pagedItems();
  }

  pagedItems() {
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    this.pagedList = this.filteredUserList.slice(start, end);
  }

  onPageChange(event: number) {
    this.page = event;
    this.pagedItems();
  }
}
