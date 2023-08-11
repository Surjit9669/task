const { mongoose } = require('mongoose');


const user = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            message: 'invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value);
            },
            message: 'password must include at least one uppercase letter, one lowercase letter and one digit',
        },
    },
});

const userModel = mongoose.model('user', user);

module.exports = { userModel }