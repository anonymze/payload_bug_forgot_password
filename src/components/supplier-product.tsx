import { supplier_products, supplier_products_rels, supplier_categories, supplier_categories_rels } from "@/payload-generated-schema";
import { eq } from "@payloadcms/db-vercel-postgres/drizzle";
import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import SupplierProductSelect from "./supplier-product-select";

const CustomServerButton: UIFieldServerComponent = async (
  props: UIFieldServerProps,
) => {
  const { id, payload } = props;

  // Récupérer tous les utilisateurs avec leur statut pour cet événement (LEFT JOIN)
  const supplierProductAssociated = await payload.db.drizzle
    .select({
      name: supplier_products.name,
      id: supplier_products.id,
      categoryName: supplier_categories.name,
      categoryId: supplier_categories.id,
    })
    .from(supplier_products)
    .innerJoin(supplier_products_rels, eq(supplier_products_rels.parent, supplier_products.id))
    .leftJoin(supplier_categories_rels, eq(supplier_categories_rels["supplier-productsID"], supplier_products.id))
    .leftJoin(supplier_categories, eq(supplier_categories.id, supplier_categories_rels.parent))
    .where(eq(supplier_products_rels.suppliersID, id?.toString() ?? "cccccccc-ee82-4aec-8626-fd2ca1baa30c"))
    .limit(1);

  const supplierProducts = await payload.db.drizzle
    .select({
      name: supplier_products.name,
      id: supplier_products.id,
    })
    .from(supplier_products)
    .orderBy(supplier_products.name)

  return (
    <div style={{ marginBottom: '20px' }}>
      <SupplierProductSelect hasId={!!id} supplierProductAssociated={supplierProductAssociated[0]} supplierProducts={supplierProducts} />
    </div>
  );
};

export default CustomServerButton;
