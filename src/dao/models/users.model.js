import mongoose from 'mongoose'

export const usersModel = mongoose.model('users', new mongoose.Schema({
    username: String,
    email: {
        type: String, unique: true
    },
    password: String,
    rol: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}))