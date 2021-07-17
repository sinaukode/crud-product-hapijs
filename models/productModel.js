const knex = require('../utils/knex');
const request = require("request");
const xml2js = require('xml2js');
const adjTrx = require('../models/adjustmentTransactionModel');

const insert = async (data) => {

    try {
        let {price, name, sku, image, description} = data;

        description = data.description ? data.description : null

        await knex.raw(`insert into tb_product values (?,?,?,?,?)`
            , [sku, name, image, price, description])
        // await knex.insert(data).into('tb_product')
        return {
            status: 200,
            message: 'Insert Product Success'
        }

    } catch (e) {
        console.warn(e)
        return {
            status: 500,
            data: e,
            message: 'Insert Failed'
        }
    }

};


const update = async (data, preSku) => {

    try {

        let price = data.price ? data.price : preSku[0].price
        let name = data.name ? data.name : preSku[0].name
        let sku = data.sku ? data.sku : preSku[0].sku
        let image = data.image ? data.image : preSku[0].image
        let description = data.description ? description : preSku[0].description

        await knex.raw(`
            UPDATE tb_product
            SET price = ?
            , name = ?
            , sku =  ?
            , image = ?
            , description = ?
            WHERE sku = ?
            `, [price, name, sku, image, description, preSku[0].sku])


        // await knex('tb_product')
        //     .where('sku', '=', data.sku)
        //     .update(data)


        return {
            status: 200,
            message: 'Update Data Success'
        }

    } catch (e) {
        console.log(e)
        return {
            status: 500,
            data: e,
            message: 'Update Failed'
        }
    }

};

const deleteData = async (paramSku) => {

    try {


        await knex.raw(`DELETE FROM tb_product WHERE sku = ?`, [paramSku])
        //delete adj trx by foreign key sku cascade

        // await knex('tb_product')
        //     .where('sku', sku)
        //     .del()


        return {
            status: 200,
            message: 'Delete Data Success'
        }


    } catch (e) {
        console.log(e)
        return {
            status: 500,
            data: e,
            message: 'delete Failed'
        }
    }

};

const getAllProduct = async (page) => {
    let resp = {}
    try {
        // Name, SKU, Image, Price, Stock
        const limit = 5;

        const offset = page ? (page - 1) * limit : 0

        let total = await knex.raw('select count(*) total from tb_product')

        let result = await knex.raw(`select p.sku,image,price,sum(qty) stock 
        from tb_product p left join tb_adj_trx adj on p.sku = adj.sku
        GROUP BY 1,2,3 limit ? offset ?`, [limit, offset])


        if (result.rows.length > 0) {
            resp.status = 200
            resp.row_count = result.rows.length
            resp.page_number = page
            resp.total_page = Math.ceil(total.rows[0].total / limit)
            resp.data = result.rows
            return resp

        } else {
            resp.status = 400
            resp.message = 'Data Not Found'
            return resp
        }


    } catch (e) {
        console.log(e)
        return {
            status: 500,
            data: e,
            message: 'Get Data Failed'
        }
    }

};

const delay = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
};


const getProductDetail = async (sku) => {
    let resp = {}
    try {
        // Name, SKU, Image, Price, Stock, Description

        let result = await knex.raw(`select p.sku,image,price,sum(qty) as stock 
        from tb_product p left join tb_adj_trx adj on p.sku = adj.sku where 
        p.sku = ?
        group by 1,2,3`
            , [sku]);


        if (result.rowCount > 0) {

            resp.status = 200;
            resp.data = result.rows;
            return resp

        } else {
            resp.status = 400;
            resp.data = 'Data Not Found';
            return resp
        }


    } catch (e) {
        console.log(e)
        return {
            status: 'nok',
            data: e,
            message: 'Get Data Failed'
        }
    }

};

const insertFromElevania = async (data) => {

    let price = data.price ? data.price : '-'
    let name = data.name ? data.name : '-'
    let sku = data.sku ? data.sku : '-'
    let image = data.image ? data.image : '-'
    let description = data.description ? data.description : '-'
    // data.sku =   data.sku ?   data.sku : null

    await knex.raw(`insert into tb_product values (?,?,?,?,?)
    ON CONFLICT (sku) DO UPDATE 
  SET name = ?
        , image =  ?
        , price = ?
        , description = ? `
        , [sku, name, image, price, description,
            name, image, price, description
        ])

}

const getRequestElevania = async (apiKey) => {
    return new Promise(function (resolve, reject) {

        request.get({
                url: `http://api.elevenia.co.id/rest/prodservices/product/listing`,
                method: "GET",
                headers: {
                    'Content-Type': 'application/xml',
                    'Accept-Charset': 'utf-8',
                    'openapikey': apiKey,
                }
            },
            function (error, response, body) {
                console.log("xml body ....\n");
                // console.dir(body);
                if (error) {
                    console.dir(error);
                    reject({
                        status: 500,
                        message: 'Internal Server Error'
                    })

                } else {

                    let parser = new xml2js.Parser();
                    parser.parseString(body, async (err, resultz) => {

                        let rezMessage = resultz.ClientMessage ? resultz.ClientMessage.message[0] : ''
                        if (rezMessage.indexOf('ERROR') !== -1) {


                            reject({
                                status: 500,
                                message: 'Error from Elevania, check your ApiKey'
                            })

                        } else {
                            // console.log(`masuksana`)
                            for (let i = 0; i < resultz.Products.product.length; i++) {
                                let prdNo = resultz.Products.product[i].prdNo[0]

                                let qty = resultz.Products.product[i].ProductOptionDetails[0].stckQty[0]
                                await delay(1000)
                                await request.get({
                                        url: `http://api.elevenia.co.id/rest/prodservices/product/details/${prdNo}`,
                                        method: "GET",
                                        headers: {
                                            'Content-Type': 'application/xml',
                                            'Accept-Charset': 'utf-8',
                                            'openapikey': apiKey,
                                        }
                                    },
                                    function (error, response, body) {
                                        console.log("xml body ....\n");
                                        // console.dir(body);
                                        if (error) {
                                            console.dir(error);
                                            reject({
                                                status: 500,
                                                message: 'Internal Server Error'
                                            })

                                        } else {

                                            let parser = new xml2js.Parser();
                                            parser.parseString(body, async (err, resp) => {

                                                let sku = resp.Product.sellerPrdCd ? resp.Product.sellerPrdCd[0] : null
                                                let name = resp.Product.prdNm ? resp.Product.prdNm[0] : null
                                                let image = resp.Product.prdImage01 ? resp.Product.prdImage01[0] : null
                                                let price = resp.Product.selPrc ? resp.Product.selPrc[0] : null
                                                let description = resp.Product.htmlDetail ? resp.Product.htmlDetail[0] : null

                                                // console.log(sku)
                                                // console.log(image)

                                                //insert product & stock
                                                try {
                                                    await insertFromElevania({sku, image, price, name, description})
                                                    await adjTrx.insert({sku, qty})
                                                } catch (e) {
                                                    console.log(e)
                                                    reject({
                                                        status: 500,
                                                        message: 'Internal Server Error'
                                                    })

                                                }


                                            })
                                        }

                                    })

                            }

                            console.log(`=============================================`)
                            resolve({
                                status: 200,
                                message: `Get Data Elevania is Done`
                            })

                        }


                    });
                }
            });
    })

}


const checkDataSku = async (sku) => {


    let result = knex.raw(`select * from tb_product where sku = ? `, [sku])

    return result

}


module.exports = {
    insert
    , update
    , deleteData
    , getAllProduct
    , getProductDetail
    , getRequestElevania
    , checkDataSku

}
