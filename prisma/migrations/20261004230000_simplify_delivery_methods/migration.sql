BEGIN;

CREATE TYPE "public"."DeliveryMethod_new" AS ENUM ('PICKUP', 'POST');

ALTER TABLE "Order"
  ALTER COLUMN "deliveryMethod"
  TYPE "public"."DeliveryMethod_new"
  USING "deliveryMethod"::text::"public"."DeliveryMethod_new";

DROP TYPE "public"."DeliveryMethod";

ALTER TYPE "public"."DeliveryMethod_new"
  RENAME TO "DeliveryMethod";

COMMIT;