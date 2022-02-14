import { ProductEffects } from './product.effect'
import { CategoryEffects } from './category.effect'
import { BranchEffects } from './branch.effect'
import { AuthEffects } from './auth.effect'
import { UserEffects } from './user.effect'
import { AddressEffects } from './address.effect'
import { LocationEffects } from './location.effect'
import { CartEffects } from './cart.effect'
import { VoucherEffects } from './voucher.effect'
import { FailureEffect } from './failure.effects'
import { SnackbarEffects } from './snackbar.effects'
import { SuccessEffect } from './success.effect'
import { OrderEffects } from './order.effect'
export * from './product.effect'

export const AppEffects = [
    ProductEffects,
    CategoryEffects,
    BranchEffects,
    AuthEffects,
    UserEffects,
    AddressEffects,
    LocationEffects,
    CartEffects,
    VoucherEffects,
    FailureEffect,
    SnackbarEffects,
    SuccessEffect,
    OrderEffects
]
