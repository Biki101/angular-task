import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  isLoading = false;
  userList: any[] = [];
  pagedList: any[] = [];
  filteredUserList: any[] = [];
  errorMessage: string = '';
  page = 1;
  pageSize = 5;
  searchQuery = '';
  showTable = true;

  constructor(
    private apiService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // getViewSetting
    const format = sessionStorage.getItem('viewFormat');

    if (format == null || format == 'table') {
      this.showTable = true;
    } else {
      this.showTable = false;
    }

    this.getUserList();

    this.activatedRoute.queryParams.subscribe((params) => {
      // Get a specific query parameter
      this.searchQuery = params['search'];
      this.filterUserList();
    });
  }

  getUserList() {
    this.isLoading = true;
    this.apiService.getUserList().subscribe({
      next: (res) => {
        this.userList = res;
        this.filteredUserList = this.userList;
        this.pagedItems();
        this.isLoading = false;

        if (this.searchQuery) {
          this.filterUserList();
        }
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

  toggleView(view: boolean) {
    this.showTable = !view;
    sessionStorage.setItem('viewFormat', this.showTable ? 'table' : 'card');
  }

  goToUserDetails(id: number) {
    console.log(id);
    this.router.navigate(['/user', id]);
  }
}
