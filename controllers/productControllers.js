require('dotenv').config();
const product = require('../models/productModel');
const {handleResponse} = require('../helpers/handleResp');

const addProduct = async (req, h) => {
    let resp = {}
    try {

        let prodData = req.payload;
        let preSku = req.pre.check_sku;

        if (preSku.length > 0) {
            resp.status = 400;
            resp.message = 'SKU Already Exist';

            return handleResponse(req, h, resp)

        }

        let result = await product.insert(prodData);

        return handleResponse(req, h, result)


    } catch (e) {
        resp.status = 500;
        resp.message = e;

        return handleResponse(req, h, resp)

    }


};


const updateProduct = async (req, h) => {
    let resp = {}
    try {

        let prodData = req.payload;
        let preSku = req.pre.check_sku

        if (preSku.length > 0) {
            let result = await product.update(prodData, preSku);


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


const getProductAll = async (req, h) => {
    let resp = {}
    let page = (req.query.page) ? req.query.page : 1;
    try {
        let result = await product.getAllProduct(page);

        return handleResponse(req, h, result)


    } catch (e) {
        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }
};

const getProductDetail = async (req, h) => {
    let resp = {}

    let preSku = req.pre.check_sku
    try {
        if (preSku.length > 0) {
            let result = await product.getProductDetail(preSku[0].sku);

            return handleResponse(req, h, result)
        } else {
            resp.status = 400;
            resp.message = 'Data SKU not Found';

            return handleResponse(req, h, resp)
        }

    } catch (e) {
        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }

};


const deleteProduct = async (req, h) => {

    let paramSku = req.params.sku;
    let preSku = req.pre.check_sku;
    let resp = {};

    try {

        if (preSku.length > 0) {
            let result = await product.deleteData(paramSku);

            return handleResponse(req, h, result)

        } else {

            resp.status = 400;
            resp.message = 'SKU not Found';

            return handleResponse(req, h, resp)

        }


    } catch (e) {

        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }
};

const getDataElevania = async (req, h) => {
    let resp = {}
    try {
        let apiKey = process.env.API_KEY_ELEVANIA

        await product.getRequestElevania(apiKey)
            .then(res => {

                resp.status = res.status
                resp.message = res.message
                // return handleResponse(req, h, res)
            }).catch(err => {

                console.log(err)

                resp.status = err.status
                resp.message = err.message
                // return handleResponse(req, h, err)
            });


        return handleResponse(req, h, resp)


    } catch (e) {
        console.log(e)
        resp.status = 500;
        resp.message = e;
        return handleResponse(req, h, resp)

    }
};


module.exports = {addProduct, updateProduct, getProductAll, deleteProduct, getProductDetail, getDataElevania};


