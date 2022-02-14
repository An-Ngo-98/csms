import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const voucherPromotionUrl = getApiUrl(ApiController.PromotionsApi.Vouchers);
const voucherInvoiceUrl = getApiUrl(ApiController.InvoicesApi.Vouchers);

const getVouchers = () => {
    const URL = voucherPromotionUrl;
    return axios.get(URL);
}

const getVoucherByCode = (code) => {
    const URL = voucherPromotionUrl + code;
    return axios.get(URL);
}

const getUsedVouchers = (userId) => {
    const URL = voucherInvoiceUrl + 'used-vouchers/' + userId;    
    return axios.get(URL);
}

export const voucherService = {
    getVouchers,
    getUsedVouchers,
    getVoucherByCode,
}