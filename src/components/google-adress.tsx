"use client";

import { FieldDescription, FieldLabel, TextInput, useActions, useField, useOperation } from "@payloadcms/ui";
import { UIFieldClientProps } from "payload";
import React from "react";
import { usePlacesWidget } from "react-google-autocomplete";

export default function GoogleAdress(props: UIFieldClientProps) {
	const { setValue: setLatitude } = useField({ path: "latitude" });
	const { setValue: setLongitude } = useField({ path: "longitude" });
	const operation = useOperation();
	const [address, setAddress] = React.useState(undefined);

	const { ref } = usePlacesWidget({
		apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_PLACES,
		onPlaceSelected: (place) => {
			const newLatitude = place.geometry?.location?.lat?.();
			const newLongitude = place.geometry?.location?.lng?.();

			setAddress(place.formatted_address);
			setLatitude(newLatitude?.toString() ?? undefined);
			setLongitude(newLongitude?.toString() ?? undefined);
		},
		options: {
			types: ["address"],
			componentRestrictions: { country: "fr" },
		},
	});

	return (
		<>
			<TextInput
				required={operation === "create"}
				label={{
					// @ts-ignore
					en: props.field.label?.en,
					// @ts-ignore
					fr: props.field.label?.fr,
				}}
				path={props.path}
				// @ts-ignore
				inputRef={ref}
				value={address}
				onChange={(e: any) => {
					setAddress(e.target.value);
				}}
				description={{
					en: "Entrez une adresse postale, derrière nous récupérerons les coordonnées géographiques pour la carte.",
					fr: "Entrez une adresse postale, derrière nous récupérerons les coordonnées géographiques pour la carte.",
				}}
			/>
		</>
	);
}
