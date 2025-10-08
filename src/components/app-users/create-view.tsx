"use client";

import { Gutter, toast, useDocumentInfo, useTranslation } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import type { DocumentViewClientProps } from "payload";
import React, { useState } from "react";

import { AppUser } from "@/payload-types";
import { z } from "zod";
import Fields from "./_fields";
import FieldsEdit from "./_fields-edit";

export const CreateAppUserView: React.FC<DocumentViewClientProps> = () => {
  const { i18n } = useTranslation();
  const [showErrorEmail, setShowErrorEmail] = useState(false);
  const [showErrorRole, setShowErrorRole] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id, initialData } = useDocumentInfo();

  if (id) {
    return (
      <main className="collection-edit collection-edit--admins">
        <div className="document-fields document-fields--no-sidebar">
          <div className="document-fields__main">
            <Gutter className="document-fields__edit">
              <FieldsEdit initialData={initialData as AppUser} />
            </Gutter>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const appleStoreCode = formData.get("apple_store_code") as string;

    if (!z.string().email().safeParse(email).success) {
      setShowErrorEmail(true);
      return;
    } else {
      setShowErrorEmail(false);
    }

    if (!role) {
      setShowErrorRole(true);
      return;
    } else {
      setShowErrorRole(false);
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/app-users/init-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
          apple_store_code: appleStoreCode,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          //@ts-ignore
          throw new Error(i18n.t("app-users:emailExists"));
        } else {
          throw new Error(
            "Une erreur est survenue, le code Apple a peut être déjà était utilisé ?",
          );
        }
      }

      //@ts-ignore
      toast.success(i18n.t("app-users:registrationSuccess"));
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(i18n.t("general:error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="collection-edit collection-edit--admins">
      <form
        action=""
        className="collection-edit__form form"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="gutter--left gutter--right doc-controls">
          <div className="doc-controls__wrapper">
            <div className="doc-controls__content">
              <ul className="doc-controls__meta">
                <li className="doc-controls__list-item">
                  {/* @ts-ignore */}
                  <p className="doc-controls__value">
                    {/* @ts-ignore */}
                    {i18n.t("app-users:createNewUser")}
                  </p>
                </li>
              </ul>
            </div>
            <div className="doc-controls__controls-wrapper">
              <div className="doc-controls__controls">
                <div className="form-submit">
                  <button
                    type="submit"
                    id="action-save"
                    className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
                  >
                    <span className="btn__content">
                      <span className="btn__label">
                        {isSubmitting
                          ? i18n.t("general:saving")
                          : i18n.t("general:save")}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="doc-controls__divider"></div>
        </div>
        <div className="document-fields document-fields--no-sidebar">
          <div className="document-fields__main">
            <Gutter className="document-fields__edit">
              <Fields
                showErrorRole={showErrorRole}
                showErrorEmail={showErrorEmail}
              />
            </Gutter>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreateAppUserView;
