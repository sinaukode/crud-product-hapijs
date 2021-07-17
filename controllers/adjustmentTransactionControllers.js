const adjTrx = require('../models/adjustmentTransactionModel');
const {handleResponse} = require('../helpers/handleResp');

const addAdjustTrx = async (req, h) => {
    let resp = {}
    try {

        let prodData = req.payload;
        let preSku = req.pre.check_sku;

        if (preSku.length > 0) {
            let result = await adjTrx.insert(prodData);
            return handleResponse(req, h, result)
        }

        resp.status = 400;
        resp.message = 'Data Sku Not Found';

        return handleResponse(req, h, resp)


    } catch (e) {
        resp.status = 500;
        resp.message = e;

        return handleResponse(req, h, resp)

    }


};


const updateAdjustTrx = async (req, h) => {
    let resp = {}
    try {

        let preAdj = req.pre.check_adj_id;
        let preSku = req.pre.check_sku
        let dataUpdate = req.payload

        //check data SKU & adj Id
        if (preSku.length > 0) {
            let result = await adjTrx.update(dataUpdate, preAdj);


            return handleResponse(req, h, result)

        } else {

            resp.status = 400;
            resp.message = 'Data SKU not Found';

            return handleResponse(req, h, resp)

        }

    } catch (e) {
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }


};


const getAdjTrxAll = async (req, h) => {
    let resp = {}
    let page = (req.query.page) ? req.query.page : 1;
    try {
        let result = await adjTrx.getAll(page);

        return handleResponse(req, h, result)


    } catch (e) {
        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }
};

const getAdjTrxDetail = async (req, h) => {
    let resp = {}

    try {
        let paramId = req.params.adj_id

        let result = await adjTrx.getDetail(paramId);

        return handleResponse(req, h, result)

    } catch (e) {
        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }

};


const deleteAdjustTrx = async (req, h) => {


    let resp = {};

    try {
        let paramId = req.params.adj_id;

        let result = await adjTrx.deleteData(paramId);

        return handleResponse(req, h, result)


    } catch (e) {

        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }
};


module.exports = {addAdjustTrx, updateAdjustTrx, getAdjTrxAll, deleteAdjustTrx, getAdjTrxDetail};


