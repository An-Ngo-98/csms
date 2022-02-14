import axios from 'axios';
import { OpenApiUrl } from '../commons/constants/open-api-url';

const locationApiUrl = OpenApiUrl.LocationApi;

const getListProvince = () => {
    const URL = locationApiUrl + 'provinces?size=100';
    return axios.get(URL);
}

const getListDistrictByProvinceId = (provinceId) => {
    const URL = locationApiUrl + 'districts?size=1000&provinceId.equals=' + provinceId;
    return axios.get(URL);
}

const getListWardByDistrictId = (districtId) => {
    const URL = locationApiUrl + 'wards?size=1000&districtId.equals=' + districtId;
    return axios.get(URL);
}

const getLocationByAddress = (address) => {
    const URL = 'https://api.opencagedata.com/geocode/v1/json?key=e9f5f181e2804424b98dd54172773eee&q=' + address;
    return axios.get(URL);
}

export const locationService = {
    getListProvince,
    getListDistrictByProvinceId,
    getListWardByDistrictId,
    getLocationByAddress
};