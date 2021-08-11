const mongoose = require('mongoose')

const { mongoURL } = require('./key');

module.exports = () => {
    mongoose.connect(
        mongoURL,
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
        (err, conn) => {
            if (err) {
                console.error('err' + err);
            }
            else {
                console.log('Database connected')
            }
        })
}