import { Router, ServerAPI } from "decky-frontend-lib"

type Tab = {
	description: string
	devtoolsFrontendUrl: string
	id: string
	title: string
	type: "page"
	url: string
	webSocketDebuggerUrl: string
}

const getStoreAppId = async (serverAPI: ServerAPI): Promise<string | null> => {
	return serverAPI
		.fetchNoCors<{ body: string }>("http://localhost:8080/json")
		.then((res) => {
			let tabs: Tab[] = []
			if (res.success) tabs = JSON.parse(res.result.body) || []
			console.log(tabs)
			const libraryTab = tabs.find((tab) =>
				tab.url.includes("/library/app/")
			)
			if (libraryTab) {
				const appId = libraryTab.url.split("/app/")[1].split("/")[0]
				return appId
			}
			const storeTab = tabs.find((tab) =>
				tab.url.includes("store.steampowered.com/app/")
			)
			if (storeTab) {
				const appId = storeTab.url
					.split("/app/")[1]
					.split("?")[0]
					.split("/")[0]
				return appId
			}
			return null
		})
}

const getCurrentAppId = async (
	serverAPI: ServerAPI
): Promise<string | null> => {
	if (Router.MainRunningApp && Router.MainRunningApp.appid) {
		return Router.MainRunningApp.appid
	} else {
		return getStoreAppId(serverAPI)
	}
}

export { getStoreAppId, getCurrentAppId }
