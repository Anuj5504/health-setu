const mongoose = require('mongoose');

const TodosSchema = new mongoose.Schema({  
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:["pending","completed"],
        required: true  
    }
});

module.exports = mongoose.model('TodosModel', TodosSchema);