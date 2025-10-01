import Component from "flarum/common/Component";
import craftBadges from "../utils/craftBadges";
import craftTags from "../utils/craftTags";
import humanTime from "flarum/common/utils/humanTime";
import icon from "flarum/common/helpers/icon";
import username from "flarum/common/helpers/username";
import Dropdown from "flarum/common/components/Dropdown";
import DiscussionControls from "flarum/forum/utils/DiscussionControls";
import Link from "flarum/common/components/Link";
import { truncate } from "flarum/common/utils/string";
import LastReplies from "./LastReplies";
import abbreviateNumber from "flarum/common/utils/abbreviateNumber";
import TerminalPost from "flarum/components/TerminalPost";
import resolveCardImage from "../helpers/resolveCardImage";

export default class ListItem extends Component {
	oninit(vnode) {
		super.oninit(vnode);
		this.discussion = this.attrs.discussion;
		this.imageUrl = null;

		this.loadImage();
	}

	async loadImage() {
		this.imageUrl = await resolveCardImage(this.discussion);
		m.redraw();
	}

	view() {
		const discussion = this.attrs.discussion;

		const settings = {};
		for (const key in app.forum.data.attributes) {
		if (key.startsWith("walsgitDiscussionCards")) {
			let newKey = key.replace("walsgitDiscussionCards", "");
			newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
			settings[newKey] = app.forum.data.attributes[key];
		}
		}

		/* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
		const viewsActivated = "flarumite-simple-discussion-views" in flarum.extensions;
		const isViewsSet = discussion.data.attributes.hasOwnProperty("views");

		const mbViewsActivated = "michaelbelgium-discussion-views" in flarum.extensions;
		const isViewCountSet = discussion.data.attributes.hasOwnProperty("viewCount");

		const viewsCount =
			viewsActivated && isViewsSet? discussion.views() :
			mbViewsActivated && isViewCountSet ? discussion.viewCount():
			NaN;

		/* Getting & setting relevant info for 3rd party Repost extension */
		const repostActivated = "shebaoting-repost" in flarum.extensions;
		const repostUrl = discussion.data.attributes.original_url || null;

		const isRead =
			Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user
			? "read"
			: "";

		const attrs = {
		className: "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : ""),
		};

		/* Card image */
		const media = this.imageUrl ? (
			<img
				src={this.imageUrl}
				className="previewCardImg"
				alt={discussion.title()}
				loading="lazy"
			/>
		) : (
			<div className="imgStub" />
			);

		/* Jump to the last relevant post (first unread or last post) */
		const jumpTo = Math.min(
			discussion.lastPostNumber() ?? 0,
			(discussion.lastReadPostNumber() || 0) + 1
		);

		/* Setting post counts & text */
		const replyText = discussion.unreadCount() ?
			app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", { count: discussion.unreadCount() }) :
			app.translator.trans("walsgit_discussion_cards.forum.replies", { count: discussion.replyCount() || "0" });

		const postCount = discussion.unreadCount() ? discussion.unreadCount() + "*"	: discussion.replyCount();

		return (
			<div
				key={discussion.id()}
				data-id={discussion.id()}
				className={
				"CardsListItem List " +
				isRead +
				(discussion.isHidden() ? " Hidden" : "")
				}
			>
				{DiscussionControls.controls(discussion, this).toArray().length
				? m(
					Dropdown,
					{
						icon: "fas fa-ellipsis-v",
						className: "DiscussionListItem-controls",
						buttonClassName:
						"Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right",
					},
					DiscussionControls.controls(discussion, this).toArray()
					)
				: ""}

				<Link href={app.route.discussion(discussion, jumpTo)} className="cardLink">
					{Number(settings.showBadges) === 1
						? craftBadges(discussion.badges().toArray())
						: ""}

					<div className="cardGrid">
						<div className="rowSpan-3 colSpan">
						<div {...attrs}>
							{(isViewsSet || isViewCountSet) &&
							Number(settings.showViews) === 1 &&
							!isNaN(viewsCount) && (
								<div className="imageLabel discussionViews">
								{icon("fas fa-eye", { className: "labelIcon" })}
								{viewsCount}
								</div>
							)}

							{media}

							{Number(settings.showAuthor) === 1 && (
							<div className="cardFoot">
								<div className="Author">{username(discussion.user())} </div>
								<div className="Date">{humanTime(discussion.createdAt())}</div>
							</div>
							)}
						</div>
						</div>

						<div className="rowSpan-3 colSpan-2">
						<div className="flexBox">
							<div className="cardTitle">
							<h2 title={discussion.title()} className="title">
								{Number(settings.allowRepostLinks) === 1 &&
								repostActivated &&
								repostUrl ? (
								<a
									href={repostUrl}
									onclick={(e) => e.stopPropagation()}
								>
									{truncate(discussion.title(), 80)}
								</a>
								) : (
								truncate(discussion.title(), 80)
								)}
							</h2>
							{app.screen() !== "phone" &&
								Number(settings.showReplies) === 1 &&
								Number(settings.showRepliesOnRight) === 1 && (
								<div className="DiscussionListItem-count">
									<span aria-hidden="true">{abbreviateNumber(postCount)}</span>
									<span className="visually-hidden">
									{app.translator.trans(
										"core.forum.discussion_list.unread_replies_a11y_label",
										{ count: discussion.replyCount() }
									)}
									</span>
								</div>
								)}
							</div>
							<div className="cardTags">{craftTags(discussion.tags())}</div>
						</div>

						{Number(settings.previewText) === 1 && discussion.firstPost() && (
							<div className="previewPost">
							{truncate(discussion.firstPost().contentPlain(), 150)}
							</div>
						)}

						{Number(settings.showLastPostInfo) === 1 && discussion.firstPost() && (
							<div className="terminalPost">
							<TerminalPost
								discussion={discussion}
								lastPost={discussion.lastPostNumber()}
							/>
							</div>
						)}

						{app.screen() === "phone" && Number(settings.showReplies) === 1 ? (
							<div className="cardSpacer">
							<Link
								className="Replies"
								href={app.route.discussion(
								discussion,
								discussion.lastPostNumber()
								)}
							>
								<div className="Left">
								<div className="Avatars">
									{m(LastReplies, { discussion: discussion })}
								</div>
								<div className="Repcount">{replyText}</div>
								</div>
								<div className="Arrow">{icon("fas fa-angle-right")}</div>
							</Link>
							</div>
						) : (
							Number(settings.showReplies) === 1 &&
							!Number(settings.showRepliesOnRight) && (
							<div className="imageLabel discussionReplyCount">
								{icon("fas fa-comment", { className: "labelIcon" })}
								{postCount}
							</div>
							)
						)}
						</div>
					</div>
				</Link>
			</div>
		);
	}
}
