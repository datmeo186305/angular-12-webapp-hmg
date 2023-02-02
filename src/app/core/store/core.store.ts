import {ModuleWithProviders, NgModule} from "@angular/core";
import {RouterStateSerializer, StoreRouterConnectingModule} from "@ngrx/router-store";
import {ActionReducer, MetaReducer, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {storeLogger} from "ngrx-store-logger";
import {localStorageSync} from "ngrx-store-localstorage";
import {effects} from "./effects";
import {CustomSerializer, reducers, State} from "./reducers";
import {environment} from "../../../environments/environment";


export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return storeLogger()(reducer);
}

export function localStorageSyncReducer(
  reducer: ActionReducer<State>
): ActionReducer<State> {
  return localStorageSync({
    keys: ["core"],
    rehydrate: true,
    storage: localStorage,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = environment.PRODUCTION
  ? [localStorageSyncReducer]
  : [logger, localStorageSyncReducer];

export const STORE_DEV_TOOLS: any[] | ModuleWithProviders<any> = environment.PRODUCTION
  ? []
  : StoreDevtoolsModule.instrument({
    maxAge: 25, // Retains last 25 states
    logOnly: environment.PRODUCTION
  });

@NgModule({
  imports: [
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot([]),


    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature(effects),

    StoreRouterConnectingModule.forRoot(),
    STORE_DEV_TOOLS
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})
export class CoreStoreModule {
  constructor() {
  }
}
