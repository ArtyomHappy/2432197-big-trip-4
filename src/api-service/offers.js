import ApiService from '../framework/api-service';

export default class Offers extends ApiService {
  get offers() {
    return this._load({ url: 'offers' }).then(ApiService.parseResponse);
  }
}
