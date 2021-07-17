-- ----------------------------
-- Table structure for tb_product
-- ----------------------------
DROP TABLE IF EXISTS "public"."tb_product";
CREATE TABLE "public"."tb_product" (
  "sku" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "image" text COLLATE "pg_catalog"."default" NOT NULL,
  "price" numeric(20) NOT NULL,
  "description" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."tb_product" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table tb_product
-- ----------------------------
ALTER TABLE "public"."tb_product" ADD CONSTRAINT "tb_product_pkey" PRIMARY KEY ("sku");

-- ----------------------------
-- Foreign Keys structure for table tb_product
-- ----------------------------
ALTER TABLE "public"."tb_product" ADD CONSTRAINT "tb_product_sku_fkey" FOREIGN KEY ("sku") REFERENCES "public"."tb_product" ("sku") ON DELETE NO ACTION ON UPDATE NO ACTION;
