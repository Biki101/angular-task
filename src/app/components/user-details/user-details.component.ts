import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  userId: string | null = null;
  user: any;

  constructor(private route: ActivatedRoute, private apiService: UserService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id'); // Retrieve the 'id' param from the route
      if (this.userId) {
        this.getUserDetails(this.userId);
      }
    });
  }

  getUserDetails(id: string) {
    this.apiService.getUserDetailsById(id).subscribe((data) => {
      this.user = data;
    });
  }
}
