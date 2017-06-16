import ApiRepository from './repository';

export default class UserRepository extends ApiRepository {
    constructor(Model) {
        super(Model, 'users');
    }

    get(accessToken, uid = '') {
        if (uid && uid.indexOf('auth0|') !== 0) uid = `auth0|${uid}`;
        return super.get(accessToken, uid);
    }
}