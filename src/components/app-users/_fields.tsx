"use client";

import { enum_app_users_role } from "@/payload-generated-schema";
import { AppUser } from "@/payload-types";
import {
  FieldDescription,
  FieldLabel,
  SelectInput,
  TextInput,
  useTranslation,
} from "@payloadcms/ui";
import React, { useState } from "react";

export default function Fields({
  showErrorRole = false,
  showErrorEmail = false,
}: {
  showErrorRole?: boolean;
  showErrorEmail?: boolean;
}) {
  const { i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [appCode, setAppCode] = useState("");
  const [role, setRole] = useState<AppUser["role"]>("associate");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/app-users/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
      } else {
        setUploadResult({ error: result.error });
      }
    } catch (error) {
      setUploadResult({ error: 'Erreur lors de l\'upload du fichier' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="render-fields document-fields__fields ">
      <div className="field-type text">
        <FieldLabel label="Email" required />
        <TextInput
          path="email"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
          showError={showErrorEmail}
          required
        />
      </div>
      <div className="field-type text">
        {/* @ts-ignore */}
        <FieldLabel label={i18n.t("app-users:labelRole")} required />
        <SelectInput
          showError={showErrorRole}
          isClearable={false}
          name="role"
          path="role"
          options={enum_app_users_role.enumValues.map((value) => ({
            // @ts-ignore
            label: i18n.t(`app-users:${value}`),
            value,
          }))}
          value={role}
          onChange={(option) => {
            // @ts-ignore
            setRole(option.value);
          }}
          required
        />
        <input type="hidden" name="role" value={role} />
      </div>
      <div className="field-type text">
        <FieldLabel label="Code de téléchargement Apple" />
        <TextInput
          path="apple_store_code"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAppCode(e.target.value)
          }
          value={appCode}
          required
        />
        <FieldDescription
          description="Si l'utilisateur utilise un iPhone (Apple), renseignez un code de téléchargement unique ici. Il recevra une notice explicative sur le téléchargement dans le mail d'inscription."
          path="apple_store_code"
        />
      </div>
      <div className="field-type upload">
        <FieldLabel label="Importer plusieurs utilisateurs depuis un fichier Excel / CSV" />
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setCsvFile(file);
            setUploadResult(null); // Reset previous results
            if (file) {
              handleFileUpload(file);
            }
          }}
          className="file-input"
          disabled={isUploading}
          key={uploadResult ? 'reset' : 'initial'} // Force re-render to allow same file upload
        />
        {isUploading && (
          <div className="upload-status">
            <p>Traitement du fichier en cours...</p>
          </div>
        )}
        {csvFile && !isUploading && (
          <div className="file-preview">
            <p>Fichier sélectionné: {csvFile.name}</p>
          </div>
        )}
        {uploadResult && (
          <div className={`upload-result ${uploadResult.error ? 'error' : 'success'}`}>
            {uploadResult.error ? (
              <div>
                <p><strong>Erreur:</strong> {uploadResult.error}</p>
                {uploadResult.expectedHeaders && (
                  <p><small>Format attendu: {uploadResult.expectedHeaders}</small></p>
                )}
              </div>
            ) : (
              <div>
                <p><strong>Succès:</strong> {uploadResult.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
