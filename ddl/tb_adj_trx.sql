-- ----------------------------
-- Table structure for tb_adj_trx
-- ----------------------------
DROP TABLE IF EXISTS "public"."tb_adj_trx";
CREATE TABLE "public"."tb_adj_trx" (
  "sku" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "qty" int4,
  "adj_id" int2 NOT NULL DEFAULT nextval('tb_adj_trx_adj_id_seq'::regclass)
)
;
ALTER TABLE "public"."tb_adj_trx" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table tb_adj_trx
-- ----------------------------
ALTER TABLE "public"."tb_adj_trx" ADD CONSTRAINT "sku_pkey" PRIMARY KEY ("adj_id");

-- ----------------------------
-- Foreign Keys structure for table tb_adj_trx
-- ----------------------------
ALTER TABLE "public"."tb_adj_trx" ADD CONSTRAINT "sku_" FOREIGN KEY ("sku") REFERENCES "public"."tb_product" ("sku") ON DELETE CASCADE ON UPDATE NO ACTION;
