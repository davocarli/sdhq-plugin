import { ServerAPI } from "decky-frontend-lib"

import { GameReview, NewsItem } from "./sdhq-types"

const POSTS_URL = "https://steamdeckhq.com/wp-json/wp/v2/posts?per_page=3"
const SETTINGS_URL =
	"https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?meta_key=steam_app_id&meta_value=${appid}"
const REVIEWS_URL =
	"https://steamdeckhq.com/wp-json/wp/v2/game-reviews/?per_page=3"

export const getNews = async (serverApi: ServerAPI) => {
	const res = await serverApi.fetchNoCors<{ body: string }>(POSTS_URL, {
		headers: { "User-Agent": "PostmanRuntime/7.30.0" },
		method: "GET",
	})

	if (res.success) {
		const posts = JSON.parse(res.result.body) as NewsItem[]
		return posts
	}
	return []
}

export const getSettings = async (
	serverApi: ServerAPI,
	appId: number | string
) => {
	const res = await serverApi.fetchNoCors<{ body: string }>(
		SETTINGS_URL.replace("${appid}", appId.toString()),
		{
			headers: { "User-Agent": "PostmanRuntime/7.30.0" },
			method: "GET",
		}
	)

	if (res.success) {
		const posts = JSON.parse(res.result.body) as GameReview[]
		return posts
	}
	return []
}

export const getLatestReviews = async (serverApi: ServerAPI) => {
	const res = await serverApi.fetchNoCors<{ body: string }>(REVIEWS_URL, {
		headers: { "User-Agent": "PostmanRuntime/7.30.0" },
		method: "GET",
	})

	if (res.success) {
		const posts = JSON.parse(res.result.body) as GameReview[]
		return posts
	}
	return []
}
