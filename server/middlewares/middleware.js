import AuthService from '../services/AuthService'

let middlewares = {

    /***************
     *
     * Middleware for adding login and logout methods to request
     *
     ***************/
    tokenTryAuth(req, res, next){
        req.login = (user) => {
            let token = AuthService.encrypt(user);
            res.cookie('__scck__', token, {
                httpOnly: true,
                path: '/',
                maxAge: 24 * 60 * 60 * 1000      //cookie will live 24 hours
            });
            return token;
        };

        next();
    },

    /***************
     *
     * Middleware for verifying auth request with token
     *
     ***************/
    tokenAuth(req, res, next){
        let token = req.headers.authorization || req.cookies['__scck__'] || req.query.token;
        if (token) {
            let userDetails = AuthService.decrypt(token);
            if (userDetails instanceof Error) {
                return res.send('401', 'Unauthorized Token');
            }
            req.user = userDetails;
            return next();
        }
        res.send('400', 'Unauthorized Request');
    }
};

export default middlewares;