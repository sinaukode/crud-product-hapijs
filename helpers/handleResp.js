let moment = require('moment')


const handleResponse = (req,h, result) => {

    try{
        // console.log(result)
        let timestamp =  moment().format('YYYY-MM-DD:HH:mm:ss')

        result.timestamp = timestamp;

        return h.response({
            result
        })
            .code(result.status).takeover();

    }catch (e) {
        console.log(e)
        return h.response({
            status : 500,
            message : 'Internal Server Error'
        })
            .code(500).takeover();

    }

};

module.exports = {handleResponse}
