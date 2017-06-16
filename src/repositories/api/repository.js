import request from 'request-promise';

export default class ApiRepository {
    constructor(Model, endpoint) {
        this.Model = Model;
        this.endpoint = endpoint;
    }

    get(accessToken, uid = '') {
        if (!accessToken) return console.log('Error: no access token found.');
        var options = {
            uri: `https://cfms.us.webtask.io/devapi/${this.endpoint}/${uid}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        return request(options).then(data => new this.Model(data));
    }

    getAll() {

    }
}