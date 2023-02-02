import {RouterEffects} from './router.effect';
import {LoginEffects} from './login.effect';
import {CustomerEffects} from './customer.effect';
import {PaydayloanEffects} from "./paydayloan.effect";

export const effects: any[] = [RouterEffects, LoginEffects, CustomerEffects, PaydayloanEffects];

export * from './router.effect';
export * from './login.effect';
export * from './customer.effect';
export * from './paydayloan.effect';
