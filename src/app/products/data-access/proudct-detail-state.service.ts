import { Injectable, inject } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { signalSlice } from 'ngxtension/signal-slice';
import { ProductsService } from './products.service';
import { Observable, map, switchMap } from 'rxjs';

interface State {
  product: Product | null;
  status: 'loading' | 'success' | 'error';
}

@Injectable()
export class ProductDetailSateService {
  private productsService = inject(ProductsService);

  private initialState: State = {
    product: null,
    status: 'loading' as const,
  };

  state = signalSlice({
    initialState: this.initialState,
    actionSources: {
      getById: (_state, $: Observable<string>) =>
        $.pipe(
          switchMap((id) => this.productsService.getProduct(id)),
          map((data) => ({ product: data, status: 'success' as const })),
        ),
    },
  });
}
