import {
	ButtonItem,
	Focusable,
	Navigation,
	PanelSection,
	PanelSectionRow,
	Router,
} from "decky-frontend-lib"

import logo from "../../assets/sdhq-logo.png"
import { GameReview, NewsItem } from "../sdhq-types"

type HomePageProps = {
	review: GameReview | null | undefined
	newsItems: NewsItem[]
	setPage: (page: "home" | "review") => void
}

export const HomePage = ({ review, newsItems, setPage }: HomePageProps) => (
	<>
		<>
			<Focusable
				onClick={() =>
					Navigation.NavigateToExternalWeb("https://steamdeckhq.com/")
				}
			>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<img style={{ width: "100%" }} src={logo} />
				</div>
			</Focusable>

			{review ? (
				<PanelSection title={review.title.rendered}>
					{review === undefined ? (
						<i>Loading...</i>
					) : review === null ? (
						<span>No SDHQ Review</span>
					) : (
						<ButtonItem
							layout="below"
							onClick={() => setPage("review")}
						>
							See Recommended Settings
						</ButtonItem>
					)}
				</PanelSection>
			) : null}

			<PanelSection title="Latest News">
				{newsItems.length === 0 ? (
					<PanelSectionRow>
						<i>Loading...</i>
					</PanelSectionRow>
				) : null}
				{newsItems.map((news) => (
					<PanelSectionRow>
						<ButtonItem
							layout="below"
							onClick={() =>
								Navigation.NavigateToExternalWeb(news.link)
							}
						>
							{news.title.rendered}
						</ButtonItem>
					</PanelSectionRow>
				))}
				<PanelSectionRow>
					<ButtonItem
						layout="below"
						onClick={() =>
							Navigation.NavigateToExternalWeb(
								"https://steamdeckhq.com/news/"
							)
						}
					>
						<i>View More...</i>
					</ButtonItem>
				</PanelSectionRow>
			</PanelSection>
		</>
	</>
)
export default HomePage
