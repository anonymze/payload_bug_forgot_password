"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  id: z.string(),
  role: z.string(),
  email: z.string().email({ message: "Entrez une adresse mail valide" }),
  password: z
    .string()
    .min(10, {
      message: "Le mot de passe doit comporter au moins 10 caractères",
    })
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: "Le mot de passe doit contenir au moins une lettre",
    })
    .refine((password) => /\d/.test(password), {
      message: "Le mot de passe doit contenir au moins un chiffre",
    }),
  lastname: z.string().min(1, { message: "Le nom est requis" }),
  firstname: z.string().min(1, { message: "Le prénom est requis" }),
  cabinet: z.string().min(1, { message: "Le nom du cabinet est requis" }),
  adress_cabinet: z
    .string()
    .optional(),
  birthday: z
    .string()
    .min(1, { message: "La date d'anniversaire est requise" }),
  entry_date: z.string().min(1, { message: "La date d'entrée est requise" }),
  rgpd: z.enum(["accept", "refuse"]),
  phone: z.string().min(10, {
    message: "Le numéro de téléphone doit comporter au moins 10 caractères",
  }),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true; // Optional field
        return file.size <= 50000000;
      },
      (file) => ({
        message: `Fichier trop lourd (${(file?.size / (1000 * 1000)).toFixed(1)} Mo). Maximum autorisé : 50 Mo`,
      }),
    ),
}).refine(
  (data) => {
    if (data.role === "independent") {
      return data.adress_cabinet && data.adress_cabinet.trim().length > 0;
    }
    return true;
  },
  {
    message: "L'adresse du cabinet est requise pour les indépendants",
    path: ["adress_cabinet"],
  }
);

export default function FormPage({
  email,
  id,
  role,
  serverURL,
  locale,
}: {
  email: string;
  id: string;
  role: string;
  serverURL: string;
  locale: string;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      role,
      email,
      password: "",
      lastname: "",
      firstname: "",
      cabinet: "",
      adress_cabinet: "",
      phone: "",
      entry_date: "",
      birthday: "",
      image: null,
      rgpd: "accept",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "profile-image",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
      form.setValue("image", null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("file", value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(
        serverURL + "/api/app-users/finish-registration",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      setSuccess(true);
    } catch (error) {
      console.log(error);
      alert("Une erreur inconnue est survenue, contactez le support.");
    } finally {
      setIsSubmitting(false);
    }
  }

  console.log(role);

  return (
    <div className="container max-w-md py-8 mx-auto">
      {!success ? (
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">
              Complétez votre inscription
            </CardTitle>
            <CardDescription>
              Veuillez remplir vos informations pour finaliser votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs text-red-500">* </p>
              <p className="text-xs text-black">Champs obligatoires</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground/50">
                        Email <span className="text-red-500/50">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="votre.email@exemple.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mot de passe <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>Au moins 10 caractères</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nom <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Prénom <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cabinet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom de votre cabinet{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adress_cabinet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Adresse de votre cabinet{" "}
                        {role === "independent" && (
                          <span className="text-red-500">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Numéro de téléphone{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+33 6 12 34 56 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date de naissance{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Date d'entrée au Groupe Valorem{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormDescription
                        style={{ marginTop: 0, marginBottom: 12 }}
                      >
                        Date approximitave si vous ne connaissez plus la date
                        exacte
                      </FormDescription>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rgpd"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Consentement des données (RGPD){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormDescription
                        className="underline underline-offset-2"
                        style={{ marginTop: 0, marginBottom: 12 }}
                      >
                        <a
                          target="_blank"
                          href="https://rgpd-and-confidentiality.vercel.app/simply_life/rgpd.html"
                        >
                          Lien vers notre charte d'utilisation des données
                        </a>
                      </FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center gap-7"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="accept" id="accept" />
                            <FormLabel
                              htmlFor="accept"
                              className="font-normal py-2"
                            >
                              J'accepte
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="refuse"
                              id="refuse"
                              className=""
                            />
                            <FormLabel
                              htmlFor="refuse"
                              className="font-normal py-2"
                            >
                              Je refuse
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo de profil</FormLabel>
                      <FormDescription
                        style={{ marginTop: 0, marginBottom: 12 }}
                      >
                        L'image ne doit pas dépasser 50 Mo
                      </FormDescription>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4">
                          {imagePreview ? (
                            <div className="relative size-24">
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Aperçu du profil"
                                fill
                                className="rounded-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : null}
                          <Input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e.target.files?.[0] || null);
                            }}
                            className={imagePreview ? "hidden" : ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Envoi en cours..."
                    : "Finaliser l'inscription"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-center">
              Inscription terminée !
            </CardTitle>
            <CardDescription className="text-center">
              Votre compte a été créé avec succès.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Vous pouvez maintenant accéder l'application mobile Simply Life
              avec vos identifiants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
