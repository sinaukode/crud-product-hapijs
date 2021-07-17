const Joi = require('joi');
const {
    addAdjustTrx, updateAdjustTrx, getAdjTrxAll, deleteAdjustTrx, getAdjTrxDetail
} = require('../controllers/adjustmentTransactionControllers');
const helper = require('../helpers/modHelpers');


module.exports = [
    {
        method: 'POST'
        , path: '/adjustmentTransaction/add'
        , options: {
            validate: {
                payload: Joi.object({
                    sku: Joi.string().required(),
                    qty: Joi.number().required()
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

        , handler: addAdjustTrx
    },

    {
        method: 'PUT'
        , path: '/adjustmentTransaction/update/{adj_id}'

        , options: {
            validate: {
                payload: Joi.object({
                    sku: Joi.string(),
                    qty: Joi.number()
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
            //check Sku & Id
            ,pre: [{method: helper.checkAdjTrxId, assign: 'check_adj_id'},
                {method: helper.checkPayloadSku, assign: 'check_sku'}]
        }

        , handler: updateAdjustTrx
    },


    {
        method: 'GET'
        , path: '/adjustmentTransaction/list'
        , handler: getAdjTrxAll
    },

    {
        method: 'GET'
        , path: '/adjustmentTransaction/detail/{adj_id}'
        , options: {
            //check adj Id
            pre: [{method: helper.checkAdjTrxId, assign: 'check_adj_id'}]
        }
        , handler: getAdjTrxDetail
    }

    , {
        method: 'DELETE'
        , path: '/adjustmentTransaction/delete/{adj_id}'
        , options: {
            //check adj Id
            pre: [{method: helper.checkAdjTrxId, assign: 'check_adj_id'}]
        }
        , handler: deleteAdjustTrx
    }
];


