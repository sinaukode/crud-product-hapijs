const knex = require('../utils/knex');

const insert = async (data) => {

    try {

        let {sku, qty} = data;

        await knex.raw(`insert into tb_adj_trx values (?,?)`
            , [sku, qty]);

        return {
            status: 200,
            message: 'Insert Product Success'
        }


    } catch (e) {
        console.warn(e);
        return {
            status: 500,
            message: 'Insert Data Failed'
        }
    }

};


const update = async (data, preAdj) => {

    try {
        console.log(preAdj)

        let sku = data.sku ? data.sku : preAdj[0].sku
        let qty = data.qty ? data.qty : preAdj[0].qty


        await knex.raw(`
            UPDATE tb_adj_trx
            SET qty = ?
            , sku = ?

            WHERE adj_id = ?
            `, [qty, sku, preAdj[0].adj_id])

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

const deleteData = async (id) => {

    try {

        await knex.raw(`DELETE FROM tb_adj_trx WHERE adj_id = ?`, [id])
        //delete adj trx by foreign key sku cascade

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

const getAll = async (page) => {
    let resp = {}
    try {
        // Name, SKU, Image, Price, Stock
        const limit = 5;

        const offset = page ? (page - 1) * limit : 0

        let total = await knex.raw('select count(*) total from tb_adj_trx')

        let result = await knex.raw(`select adj_id,adj.sku,qty,(qty * p.price) amount 
                                from tb_adj_trx adj join tb_product p on  adj.sku = p.sku 
                                GROUP BY 1,2,3,4 limit ? offset ?`, [limit, offset])


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


const checkAdjTrxId = async (adjId) => {

    try {

        let result = knex.raw(`select * from tb_adj_trx where adj_id = ? `, [adjId])

        return result
    } catch (e) {
        return null
    }


}


const getDetail = async (id) => {
    let resp = {}
    try {
        // Name, SKU, Image, Price, Stock, Description

        let result = await knex.raw(`select adj_id,adj.sku,qty,(qty * p.price) amount from tb_adj_trx adj 
        join tb_product p on  adj.sku = p.sku  where 
        adj_id = ?`, [id]);


        if (result.rows.length > 0) {
            resp.status = 200
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
            status: 'nok',
            data: e,
            message: 'Get Data Failed'
        }
    }

};

module.exports = {
    insert, update, deleteData, getAll, getDetail, checkAdjTrxId
}
