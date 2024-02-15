const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: {type: Number, required:  true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String, required: true },
    profilePicture: { type: String }
});

module.exports = mongoose.model('Employee', employeeSchema);
