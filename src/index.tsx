import {
	definePlugin,
	Router,
	ServerAPI,
	staticClasses,
} from "decky-frontend-lib"
import { useEffect, useState, VFC } from "react"

import { getStoreAppId } from "./helpers"
import HomePage from "./pages/home"
import HQLogo from "./pages/HQLogo"
import { ReviewPage } from "./pages/review"
import { getNews, getSettings } from "./requests"
import { GameReview, NewsItem } from "./sdhq-types"

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
	const [page, setPage] = useState<"home" | "review">("home")
	const [newsItems, setNewsitems] = useState<NewsItem[]>([])
	const [review, setReview] = useState<GameReview | null | undefined>()

	const refreshNews = () => {
		getNews(serverAPI).then((news) => {
			// console.log(news)
			setNewsitems(news)
		})
	}

	const getGameSettings = () => {
		const storeApp = getStoreAppId()
		// console.log(`Store App: ${storeApp}`)
		if (storeApp) {
			getSettings(serverAPI, storeApp).then((settings) => {
				// console.log("quick test")
				// console.log(`Settings: ${JSON.stringify(settings)}`)
				setReview(settings[0])
			})
		} else if (Router.MainRunningApp) {
			console.log(`Running App: ${Router.MainRunningApp.appid}`)
			getSettings(serverAPI, Router.MainRunningApp.appid).then(
				(settings) => {
					// console.log("quick test")
					// console.log(`Settings: ${JSON.stringify(settings)}`)
					setReview(settings[0])
				}
			)
		}
	}

	useEffect(() => {
		console.log("Getting Review")
		getGameSettings()
		setPage("home")
	}, [
		Router.MainRunningApp,
		// @ts-ignore
		Router.WindowStore?.GamepadUIMainWindowInstance?.m_history.location
			.state.url,
	])

	useEffect(() => {
		refreshNews()
	}, [])

	if (page === "review" && review)
		return <ReviewPage review={review} setPage={setPage} />

	return <HomePage review={review} newsItems={newsItems} setPage={setPage} />
}

export default definePlugin((serverApi: ServerAPI) => {
	return {
		title: <div className={staticClasses.Title}>Example Plugin</div>,
		content: <Content serverAPI={serverApi} />,
		icon: <HQLogo />,
		alwaysRender: true,
		onDismount() {},
	}
})
