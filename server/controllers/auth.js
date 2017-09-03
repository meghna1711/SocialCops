import mongoose from 'mongoose';

export default (req, res) => {
    const UserModel = mongoose.model('User');
    const username = req.body.username;
    const password = req.body.password;

    if (!username) return res.send(400, 'Username is required');
    if (!password) return res.send(400, 'Password is required');

    UserModel.findOne({username: username, password: password})
        .exec((err, _user) => {
            if (err) return res.send(500, 'Internal Server Error');
            else if (!_user) return res.send(500, 'Username and Password did not match !!');
            else {
                const token = req.login(_user);
                const userDetails = {
                    username: _user.username,
                    _id: _user._id,
                    token: token
                };
                res.status(200).send(userDetails);
            }
        })
}
