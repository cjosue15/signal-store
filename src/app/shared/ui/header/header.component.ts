import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStateService } from '../../data-access/cart-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  cartState = inject(CartStateService).state;
}
