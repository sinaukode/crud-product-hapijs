
const {handleResponse} = require('../helpers/handleResp');
const adjTrx = require('../models/adjustmentTransactionModel');
const product = require('../models/productModel');


const checkPayloadSku = async (req, h) => {
    let resp = {}
    try {

        let sku = req.params.sku ? req.params.sku : req.payload.sku;

        let res = await product.checkDataSku(sku);

        return res.rows

    } catch (e) {

        console.log(e)
        resp.status = 500;
        resp.message = 'Internal Server Error';

        return handleResponse(req, h, resp)
    }

};

const checkAdjTrxId = async (req, h) => {
    let resp = {}
    try {


        let id = req.params.adj_id ? req.params.adj_id : req.payload.adj_id;

        console.log(id)

        let result = await adjTrx.checkAdjTrxId(id);

        if(result.rowCount > 0){

            return result.rows
        }

        resp.status = 400;
        resp.message = 'Id of Adjustment Transaction not found';


        return handleResponse(req, h, resp)


    } catch (e) {

        console.log(e)
        resp.status = 500;
        resp.message = 'Internal Server Error';

        return handleResponse(req, h, resp)

    }

};




module.exports = {
    checkAdjTrxId
    ,checkPayloadSku
}
