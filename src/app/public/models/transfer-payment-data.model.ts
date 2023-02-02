import { PaymentProductInfo } from './payment-product-info.model';
import { PaymentUserInfo } from './payment-user-info.model';
import { PaymentVirtualAccount } from './payment-virtual-account.model';

export interface TransferPaymentData {
  productInfo?: PaymentProductInfo;
  userInfo?: PaymentUserInfo;
  vaInfo?: PaymentVirtualAccount;
}
