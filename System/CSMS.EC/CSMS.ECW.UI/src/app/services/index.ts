import { ProductService } from './product/product.service';
import { LocalStorageService } from './local-storage.service';
import { CategoryService } from './product/category.service';
import { BranchService } from './system/branch.service';
import { AuthServiceLocal } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AddressService } from './user/address.service';
import { LocationService } from './system/location.service';
import { CartService } from './cart/cart.service';
import { VoucherService } from './cart/voucher.service';
import { OrderService } from './cart/order.service';

export const AppServices = [
    ProductService,
    LocalStorageService,
    CategoryService,
    BranchService,
    AuthServiceLocal,
    UserService,
    AddressService,
    LocationService,
    CartService,
    VoucherService,
    OrderService
]
