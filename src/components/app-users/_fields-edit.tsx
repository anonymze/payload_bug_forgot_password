// @ts-nocheck
"use client";

import type { AppUser, Media } from "@/payload-types";
import {
  DatePicker,
  FieldLabel,
  TextInput,
  toast,
  useTranslation,
} from "@payloadcms/ui";
import React, { useState } from "react";

export default function FieldsEdit({ initialData }: { initialData: AppUser }) {
  const { i18n } = useTranslation();
  const [photoData, setPhotoData] = useState<Media | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    role: initialData.role,
    lastname: initialData.lastname,
    firstname: initialData.firstname,
    phone: initialData.phone ?? "",
    cabinet: initialData.cabinet ?? "",
    adress_cabinet: initialData.adress_cabinet ?? "",
    entry_date: initialData.entry_date ?? undefined,
    birthday: initialData.birthday ?? undefined,
  });
  const { id: userId } = initialData;

  // Fetch the photo data if we have a photo ID
  React.useEffect(() => {
    if (initialData.photo && typeof initialData.photo === "string") {
      fetch(`/api/media/${initialData.photo}`)
        .then((res) => res.json())
        .then((data) => setPhotoData(data))
        .catch((err) => console.error("Error fetching photo:", err));
    }
  }, [initialData.photo]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/app-users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          entry_date: formData.entry_date || undefined,
          birthday: formData.birthday || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("Utilisateur mis à jour avec succès !");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="render-fields document-fields__fields">
      <div className="field-type text">
        <FieldLabel label={i18n.t("app-users:labelPhoto")} />
        <div className="field-type upload">
          <div className="upload__wrap">
            <div className="upload__image-container">
              {isUploading ? (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      border: "3px solid #e0e0e0",
                      borderTop: "3px solid #000",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <style>
                    {`
											@keyframes spin {
												0% { transform: rotate(0deg); }
												100% { transform: rotate(360deg); }
											}
										`}
                  </style>
                </div>
              ) : photoData && photoData.url ? (
                <img
                  src={photoData.url}
                  alt={"photo"}
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", width: 120, height: 120 }}
                />
              ) : (
                <img
                  src="/images/icon.png"
                  alt="photo"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", width: 120, height: 120 }}
                />
              )}

              <p
                style={{
                  paddingTop: "0.5rem",
                  marginBottom: 0,
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                {" "}
                L'image ne doit pas dépasser 50 Mo
              </p>

              <div className="upload__actions">
                <button
                  type="button"
                  className="btn btn--style-primary btn--icon-style-without-border btn--size-small"
                  style={{ marginTop: "0.8rem" }}
                  onClick={() =>
                    document.getElementById("photo-upload")?.click()
                  }
                  disabled={isUploading}
                >
                  {i18n.t("app-users:uploadPhoto")}
                </button>
              </div>
            </div>

            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="upload__input"
              style={{
                width: "0.1px",
                height: "0.1px",
                opacity: 0,
                overflow: "hidden",
                position: "absolute",
                zIndex: -1,
              }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 50000000) {
                  alert("Le fichier dépasse la limite de 50 Mo");
                  return;
                }

                setIsUploading(true);
                const formData = new FormData();
                formData.append("file", file);
                formData.append(
                  "_payload",
                  JSON.stringify({
                    alt: "file.name",
                  }),
                );

                try {
                  // First upload the media
                  const mediaResponse = await fetch("/api/media", {
                    method: "POST",
                    body: formData,
                  });

                  if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    setPhotoData(mediaData.doc);

                    // Then update the user with the new photo ID
                    const userResponse = await fetch(
                      `/api/app-users/${userId}`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          photo: mediaData.doc.id,
                        }),
                      },
                    );

                    if (!userResponse.ok) {
                      throw new Error("Failed to update user photo");
                    }
                  }
                } catch (err) {
                  console.error("Error updating photo:", err);
                } finally {
                  setIsUploading(false);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="field-type text">
        <FieldLabel
          label={
            <span>
              Email <span style={{ color: "red" }}>*</span>
            </span>
          }
        />
        <TextInput
          path="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
          value={initialData.email}
          readOnly
        />
      </div>
      <div className="field-type text">
        <FieldLabel
          label={
            <span>
              {i18n.t("app-users:labelRole")}{" "}
              <span style={{ color: "red" }}>*</span>
            </span>
          }
        />
        <select
          className="input"
          value={formData.role}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFormData((prev) => ({
              ...prev,
              role: e.target.value as
                | "associate"
                | "employee"
                | "independent"
                | "visitor",
            }))
          }
        >
          <option value="associate">Associé</option>
          <option value="employee">Employé</option>
          <option value="independent">Indépendant</option>
          <option value="visitor">Visiteur</option>
        </select>
      </div>
      <div className="field-type text">
        <FieldLabel
          label={
            <span>
              {i18n.t("app-users:labelLastname")}{" "}
              <span style={{ color: "red" }}>*</span>
            </span>
          }
        />
        <TextInput
          path="lastname"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, lastname: e.target.value }))
          }
          value={formData.lastname}
        />
      </div>
      <div className="field-type text">
        <FieldLabel
          label={
            <span>
              {i18n.t("app-users:labelFirstname")}{" "}
              <span style={{ color: "red" }}>*</span>
            </span>
          }
        />
        <TextInput
          path="firstname"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, firstname: e.target.value }))
          }
          value={formData.firstname}
        />
      </div>
      <div className="field-type text">
        <FieldLabel label={<span>Nom du cabinet  <span style={{ color: "red" }}>*</span></span>} />
        <TextInput
          path="cabinet"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, cabinet: e.target.value }))
          }
          value={formData.cabinet}
        />
      </div>
      <div className="field-type text">
        <FieldLabel label={<span>Téléphone  <span style={{ color: "red" }}>*</span></span>} />
        <TextInput
          path="phone"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          value={formData.phone}
        />
      </div>

      <div className="field-type text">
        <FieldLabel label={<span>Adresse du cabinet</span>} />
        <TextInput
          path="adress_cabinet"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, adress_cabinet: e.target.value }))
          }
          value={formData.adress_cabinet}
        />
      </div>

      <div className="field-type text">
        <FieldLabel label={<span>Date d'entrée  <span style={{ color: "red" }}>*</span></span>} />
        <DatePicker
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              entry_date: date ? date.toISOString().split("T")[0] : undefined,
            }))
          }
          value={
            formData.entry_date ? new Date(formData.entry_date) : undefined
          }
          placeholder="Sélectionnez une date"
          displayFormat="dd/MM/yyyy"
        />
      </div>
      <div className="field-type text">
        <FieldLabel label={<span>Date de naissance  <span style={{ color: "red" }}>*</span></span>} />
        <DatePicker
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              birthday: date ? date.toISOString().split("T")[0] : undefined,
            }))
          }
          value={formData.birthday ? new Date(formData.birthday) : undefined}
          placeholder="Sélectionnez une date"
          displayFormat="dd/MM/yyyy"
        />
      </div>
      <div className="field-type text" style={{ marginTop: "20px" }}>
        <button
          type="button"
          className="btn btn--style-primary btn--size-large"
          onClick={handleSave}
          disabled={isSaving}
          style={{ width: "100%" }}
        >
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
