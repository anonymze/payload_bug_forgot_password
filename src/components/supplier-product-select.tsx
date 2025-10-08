"use client";

import { useField } from "@payloadcms/ui";
import React from "react";

interface Product {
  name: string;
  id: string;
  categoryName: string | null;
  categoryId: string | null;
}

interface SupplierProductSelectProps {
  supplierProductAssociated: Product | undefined;
  hasId: boolean;
  supplierProducts: Pick<Product, "id" | "name">[];
}

const CIF_ID = "59cdc1f8-2282-4a2c-83f4-53a124107876";
const IAS_ID = "4767e8ae-0452-480e-a33b-14cb471e1d2f";
const SCPI_ID = "c3ad1f0e-af17-4425-b1cf-4ec3da2f9877";
const IMMOBILIER_ID = "8b2b3a4a-1ff4-44ca-8eb0-52b23d5b00e6";
export const includeProductSupplierIds = [
	// dettes privées obligatoires
	"46c9b876-9b9b-4779-b8ff-e4af9d56914e",
	// capital investissement
	"2b78beef-9304-4ea2-aa2a-22ab551a22ae",
	// éligibles assurances vies
	"8fbcc7b1-6c44-45f5-af85-bb500ab4166c",
	// 150 0B TER
	"6871100f-d1ae-4326-93f9-d4f5117243ab",
	// PRIVATE EQUITY
	'42369074-6134-4d77-8a91-46f9a2efb1c4'
	// FCPR
	// "949d4203-a2f3-40cc-b5cc-fcfe4464ccd8",
];

const SupplierProductSelect: React.FC<SupplierProductSelectProps> = ({
  supplierProductAssociated,
  hasId,
  supplierProducts,
}) => {
  const { setValue: setSupplierProductId } = useField({
    path: "supplier_product_id",
  });

  const defaultId = supplierProductAssociated
    ? supplierProductAssociated.id
    : "";

  React.useEffect(() => {
    if (defaultId && setSupplierProductId) setSupplierProductId(defaultId);
  }, [defaultId, setSupplierProductId]);

  React.useEffect(() => {
    if (!hasId) return;
    const otherInfoField = document.getElementById("field-other_information");
    const enveloppeField = document.getElementById("field-enveloppe");
    const fondField = document.getElementById("field-fond");

    if (otherInfoField) {
      if (supplierProductAssociated?.categoryId !== SCPI_ID) {
        otherInfoField.style.display = "none";
      } else {
        otherInfoField.style.display = "flex";
      }
    }

    if (enveloppeField) {
      if (supplierProductAssociated?.categoryId !== CIF_ID) {
        enveloppeField.style.display = "none";
      } else {
        enveloppeField.style.display = "revert";
      }
    }

    if (fondField) {
      if (supplierProductAssociated?.id && includeProductSupplierIds.includes(supplierProductAssociated?.id)) {
        fondField.style.display = "flex";
      } else {
        fondField.style.display = "none";
      }
    }
  }, [supplierProductAssociated?.categoryId, hasId, supplierProductAssociated?.id]);

  return (
    <>
      <label
        htmlFor="supplier_product_id"
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          color: "#374151",
          marginBottom: "6px",
        }}
      >
        Produits de fournisseurs
      </label>
      <select
        id="supplier_product_id"
        name="supplier_product_id"
        defaultValue={defaultId}
        onChange={(e) => {
          setSupplierProductId(e.target.value);
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "white",
          color: "#374151",
          outline: "none",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        <option value="">Sélectionnez un produit</option>
        {supplierProducts.map((product, index) => (
          <option key={index} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SupplierProductSelect;
