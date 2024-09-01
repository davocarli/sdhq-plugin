import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib"
import { useEffect, useState, VFC } from "react"

import { getCurrentAppId } from "./helpers"
import HomePage from "./pages/home"
import HQLogo from "./pages/HQLogo"
import { ReviewPage } from "./pages/review"
import { getLatestReviews, getNews, getSettings } from "./requests"
import { GameReview, NewsItem } from "./sdhq-types"

//@ts-ignore
window.sdhqReview = null

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
	const [page, setPage] = useState<"home" | "review">("home")
	const [newsItems, setNewsitems] = useState<NewsItem[]>([])
	const [review, setReview] = useState<GameReview | null | undefined>()
	const [currentAppId, setCurrentAppId] = useState<string | null | undefined>(
		undefined
	)
	const [latestReviews, setLatestReviews] = useState<null | GameReview[]>(
		null
	)

	const refreshAppId = () => {
		getCurrentAppId(serverAPI).then((appId) => setCurrentAppId(appId))
	}

	useEffect(() => {
		//@ts-ignore
		if (currentAppId === undefined && window.sdhqReview) {
			//@ts-ignore
			setReview(window.sdhqReview)
			setPage("review")
		} else if (currentAppId) {
			if (
				//@ts-ignore
				window.sdhqReview &&
				//@ts-ignore
				window.sdhqReview.acf.steam_app_id === currentAppId
			) {
				//@ts-ignore
				setReview(window.sdhqReview)
				setPage("review")
			} else {
				getSettings(serverAPI, currentAppId).then((settings) => {
					setReview(settings[0])
					setPage("home")
				})
			}
		} else {
			setPage("home")
			//@ts-ignore
			window.sdhqReview = null
		}
	}, [currentAppId])

	useEffect(() => {
		if (page === "home") {
			//@ts-ignore
			window.sdhqReview = null
		} else if (page === "review") {
			//@ts-ignore
			window.sdhqReview = review
		}
	}, [page])

	useEffect(() => {
		refreshAppId()
		getNews(serverAPI).then((news) => setNewsitems(news))
		getLatestReviews(serverAPI).then((reviews) => setLatestReviews(reviews))
	}, [])

	if (page === "review" && review)
		return <ReviewPage review={review} setPage={setPage} />

	return (
		<HomePage
			review={review}
			newsItems={newsItems}
			setPage={setPage}
			reviewItems={latestReviews}
			appIsActive={currentAppId !== null}
		/>
	)
}

export default definePlugin((serverApi: ServerAPI) => {
	return {
		title: <div className={staticClasses.Title}>Steam Deck HQ</div>,
		content: <Content serverAPI={serverApi} />,
		icon: <HQLogo />,
		alwaysRender: false,
		onDismount() {},
	}
})
