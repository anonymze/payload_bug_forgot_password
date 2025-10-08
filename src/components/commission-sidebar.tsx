"use client";

import { useDocumentInfo, Button, usePayloadAPI } from "@payloadcms/ui";
import { UIFieldClientComponent, UIFieldClientProps } from "payload";
import React, { useState } from "react";

const CommissionSidebar: UIFieldClientComponent = (props: UIFieldClientProps) => {
	return (
		<div>
			<Button buttonStyle="primary" size="large" onClick={() => {
				console.log("clicked");
			}}>
				Envoyer un mail récapitulatif
			</Button>
		</div>
	);
};

export default CommissionSidebar;
