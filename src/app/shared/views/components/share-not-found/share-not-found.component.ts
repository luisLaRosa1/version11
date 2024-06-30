import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-not-found',
  templateUrl: './share-not-found.component.html',
})
export class ShareNotFoundComponent {
  constructor(private readonly router: Router) {}

  goLogin(): void {
    this.router.navigateByUrl('/authentication/login');
  }
}
