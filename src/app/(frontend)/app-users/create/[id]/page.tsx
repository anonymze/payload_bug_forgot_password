import config from "@payload-config";

import FormPage from "./form";


const messages = {
	en: {
		pageNotFound: "This page does not exist.",
	},
	fr: {
		pageNotFound: "Cette page n'existe pas.",
	},
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id;
	const configData = await config;
	const serverURL = configData.serverURL;
	const locale =
		configData.localization &&
		typeof configData.localization === "object" &&
		"defaultLocale" in configData.localization
			? (configData.localization.defaultLocale as keyof typeof messages)
			: "en";

	try {
		const response = await fetch(serverURL + "/api/temporary-app-users/" + id, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `admins API-Key ${process.env.ADMIN_API_KEY}`,
			},
		});

		if (!response.ok) return <div className="p-2">{messages[locale].pageNotFound}</div>;

		const user = await response.json();

		return <FormPage locale={locale} serverURL={serverURL} email={user.email} id={id} role={user.role} />;
	} catch (error) {
		return <div className="p-2">{messages[locale].pageNotFound}</div>;
	}
}
 