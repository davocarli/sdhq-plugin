import { Router } from "decky-frontend-lib"

const getStoreAppId = (): string | null => {
	const url =
		//@ts-ignore
		Router.WindowStore?.GamepadUIMainWindowInstance?.m_history.location
			.state.url
	if (url && url.includes("store.steampowered.com/app/")) {
		const appId = url.split("/app/")[1].split("?")[0]
		return appId
	}
	return null
}

export { getStoreAppId }
