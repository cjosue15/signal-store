import { Injectable, Signal, inject } from '@angular/core';
import { ProductItemCart } from '../interfaces/product.interface';
import { signalSlice } from 'ngxtension/signal-slice';
import { StorageService } from './storage.service';
import { Observable, map } from 'rxjs';

interface State {
  products: ProductItemCart[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CartStateService {
  private _storageService = inject(StorageService);

  private initialState: State = {
    products: [],
    loaded: false,
  };

  loadProducts$ = this._storageService
    .loadProducts()
    .pipe(map((products) => ({ products, loaded: true })));

  state = signalSlice({
    initialState: this.initialState,
    sources: [this.loadProducts$],
    selectors: (state) => ({
      count: () =>
        state().products.reduce((acc, product) => acc + product.quantity, 0),
      price: () => {
        return state().products.reduce(
          (acc, product) => acc + product.product.price * product.quantity,
          0,
        );
      },
    }),
    actionSources: {
      add: (state, action$: Observable<ProductItemCart>) =>
        action$.pipe(map((product) => this.add(state, product))),
      remove: (state, action$: Observable<number>) =>
        action$.pipe(map((id) => this.remove(state, id))),
      udpate: (state, action$: Observable<ProductItemCart>) =>
        action$.pipe(map((product) => this.update(state, product))),
    },
    effects: (state) => ({
      load: () => {
        if (state().loaded) {
          this._storageService.saveProducts(state().products);
        }
      },
    }),
  });

  private add(state: Signal<State>, product: ProductItemCart) {
    const isInCart = state().products.find(
      (productInCart) => productInCart.product.id === product.product.id,
    );

    if (!isInCart) {
      return {
        products: [...state().products, { ...product, quantity: 1 }],
      };
    }

    isInCart.quantity += 1;
    return {
      products: [...state().products],
    };
  }

  private remove(state: Signal<State>, id: number) {
    return {
      products: state().products.filter((product) => product.product.id !== id),
    };
  }

  private update(state: Signal<State>, product: ProductItemCart) {
    const products = state().products.map((productInCart) => {
      if (productInCart.product.id === product.product.id) {
        return { ...productInCart, quantity: product.quantity };
      }

      return productInCart;
    });

    return { products };
  }
}
