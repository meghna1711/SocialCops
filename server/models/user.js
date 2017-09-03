import mongoose from 'mongoose';

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const User = new Schema({
    username: String,
    password: String
});

export default User;