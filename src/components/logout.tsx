import { I18nServer } from "node_modules/@payloadcms/translations/dist/types";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";


export default function Logout({
  i18n, 
}: {
  i18n: I18nServer
}) {
	return (
		<Link id="logout-button" href="/admin/logout">
			<LogOutIcon size={25} />
			<span>{i18n.translations.authentication.logout}</span>
		</Link>
	);
}	
