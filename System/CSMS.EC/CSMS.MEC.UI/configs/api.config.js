const URL = 'http://52.74.41.113:3001';

export const getApiUrl = (apiController) => {
    return apiController ? URL + apiController : URL;
}