import type {
  DefaultTranslationsObject,
  I18nOptions,
} from "@payloadcms/translations";
import { en } from "@payloadcms/translations/languages/en";
import { fr } from "@payloadcms/translations/languages/fr";

export const customTranslations = {
  fallbackLanguage: "fr",
  supportedLanguages: { fr, en },
  translations: {
    en: {
      custom: {
        errorlengthPassword:
          "The password must contain at least 10 characters.",
        errorLettersPassword: "The password must contain at least one letter.",
        errorNumbersPassword: "The password must contain at least one number.",
        textBeforeLogin:
          "Welcome to the Simply Life administration. Simplify your employees daily lives simply and effectively.",
        passwordsDoNotMatch: "Passwords do not match",
        invalidToken: "Invalid Registration Link",
        invalidTokenMessage: "The registration link is invalid or has expired.",
        registrationComplete: "Registration Complete",
        registrationCompleteMessage:
          "Your account has been successfully created. You can now log in.",
        goToLogin: "Go to Login",
        completeRegistration: "Complete Registration",
        password: "Password",
        confirmPassword: "Confirm Password",
      },
      general: {
        createNew: "Create a new item",
        createNewLabel: "Create a new item",
        saving: "Saving...",
        error: "An error occurred",
      },
      "app-users": {
        createNewUser: "Create a new app user",
        noPhoto: "No photo",
        labelRole: "Role",
        labelPhone: "Phone",
        labelLastname: "Lastname",
        labelFirstname: "Firstname",
        labelPhoto: "photo",
        uploadPhoto: "Upload Photo",
        associate: "Associate",
        employee: "Employee",
        independent: "Independent",
        visitor: "Visitor",
        registrationSuccess:
          "An email has been sent to the user to complete the registration.",
        emailExists: "An user with this email already exists.",
        generalError: "An error occurred during registration.",
        validationError: "Please check your input and try again.",
        emailSubject: "Welcome to Simply Life, complete your account",
      },
    },
    fr: {
      custom: {
        errorlengthPassword:
          "Le mot de passe doit contenir au moins 10 caractères.",
        errorLettersPassword:
          "Le mot de passe doit contenir au moins une lettre.",
        errorNumbersPassword:
          "Le mot de passe doit contenir au moins un chiffre.",
        textBeforeLogin:
          "Bienvenue dans l'administration Simply Life. Simplifiez le quotidien de vos employés simplement et efficacement.",
        passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
        invalidToken: "Lien d'inscription invalide",
        invalidTokenMessage: "Le lien d'inscription est invalide ou a expiré.",
        registrationComplete: "Inscription terminée",
        registrationCompleteMessage:
          "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        goToLogin: "Aller à la connexion",
        completeRegistration: "Terminer l'inscription",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
      },
      general: {
        createNew: "Créer un nouvel élément",
        createNewLabel: "Créer un nouvel élément",
        saving: "Enregistrement...",
        error: "Une erreur est survenue",
      },
      suppliers: {
        createNew: "Créer un nouvel élémendzdzt",
        createNewLabel: "Créer un nouvel élément",
      },
      "app-users": {
        createNewUser: "Créer un nouvel utilisateur",
        labelRole: "Rôle",
        noPhoto: "Pas de photo",
        labelPhone: "Téléphone",
        labelLastname: "Nom",
        labelFirstname: "Prénom",
        uploadPhoto: "Changer de photo",
        labelPhoto: "Photo",
        associate: "Associé",
        employee: "Employé",
        independent: "Indépendant",
        visitor: "Visiteur",
        registrationSuccess:
          "Un email a été envoyé à l'utilisateur pour terminer sa création de compte.",
        emailExists: "Un utilisateur avec cet email existe déjà.",
        generalError: "Une erreur est survenue lors de l'inscription.",
        validationError: "Veuillez vérifier vos informations et réessayer.",
        emailSubject: "Bienvenue sur Simply Life, complétez votre compte",
      },
    },
  },
} as I18nOptions<{} | DefaultTranslationsObject>;

// export type CustomTranslationsObject = typeof customTranslations.en &
//   typeof enTranslations
// export type CustomTranslationsKeys =
//   NestedKeysStripped<CustomTranslationsObject>
