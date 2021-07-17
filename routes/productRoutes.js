const Joi = require('joi');
const {
    addProduct, updateProduct, getProductAll, deleteProduct, getProductDetail, getDataElevania
} = require('../controllers/productControllers');
const helper = require('../helpers/modHelpers');


module.exports = [
    {
        method: 'POST'
        , path: '/product/add'
        , options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    sku: Joi.string().required(),
                    price: Joi.number().required(),
                    image: Joi.string().required(),
                    description: Joi.string()

                }),
                failAction: (request, h, error) => {
                    console.log(error)
                    let resp = {
                        status: error.output.statusCode,
                        message: error.details[0].message.replace(/['"]+/g, '')
                    }

                    return h.response(resp).code(resp.status).takeover();
                }
            }
            //check sku
            , pre: [{method: helper.checkPayloadSku, assign: 'check_sku'}]
        }

        , handler: addProduct
    },

    {
        method: 'PUT'
        , path: '/product/update/{sku}'

        , options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string(),
                    sku: Joi.string(),
                    price: Joi.number(),
                    image: Joi.string(),
                    description: Joi.string()

                }),
                failAction: (request, h, error) => {
                    // console.log(error)
                    let resp = {
                        status: error.output.statusCode,
                        message: error.details[0].message.replace(/['"]+/g, '')
                    }

                    return h.response(resp).code(resp.status).takeover();
                }
            }
            //check sku
            , pre: [{method: helper.checkPayloadSku, assign: 'check_sku'}]
        }

        , handler: updateProduct
    },


    {
        method: 'GET'
        , path: '/product/list'
        , handler: getProductAll
    },

    {
        method: 'GET'
        , path: '/product/detail/{sku}'
        , options: {
            //check sku
            pre: [{method: helper.checkPayloadSku, assign: 'check_sku'}]
        }

        , handler: getProductDetail
    }

    , {
        method: 'DELETE'
        , path: '/product/delete/{sku}'
        , options: {
            //check sku
            pre: [{method: helper.checkPayloadSku, assign: 'check_sku'}]
        }
        , handler: deleteProduct
    }
    , {
        method: 'POST'
        , path: '/product/elevania'
        , handler: getDataElevania
    }
];


