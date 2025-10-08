import type { I18nClient } from '@payloadcms/translations';


export default function BeforeLogin({i18n}: {i18n: I18nClient}) {
	return (
		<p id="before-login">
			{/* @ts-ignore */}
			{i18n.translations.custom.textBeforeLogin}
		</p>
	);
}
