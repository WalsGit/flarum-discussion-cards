import Component from "flarum/common/Component";
import craftBadges from "../utils/craftBadges";
import getPostImage from "../helpers/getPostImage";
import craftTags from "../utils/craftTags";
import humanTime from "flarum/common/utils/humanTime";
import icon from "flarum/common/helpers/icon";
import username from "flarum/common/helpers/username";
import Dropdown from "flarum/common/components/Dropdown";
import DiscussionControls from "flarum/forum/utils/DiscussionControls";
import Link from "flarum/common/components/Link";
import { truncate } from "flarum/common/utils/string";
import LastReplies from "./LastReplies";
import compareTags from "../helpers/compareTags";

export default class cardItem extends Component {
	oninit(vnode) {
		super.oninit(vnode);
		this.discussion = this.attrs.discussion;
	}

	view() {
		const discussion = this.discussion;
		const settings = {};
		for (const key in app.forum.data.attributes) {
			if (key.startsWith('walsgitDiscussionCards')) {
				let newKey = key.replace('walsgitDiscussionCards', '');
				newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
				settings[newKey] = app.forum.data.attributes[key];
			}
		}
		const isTagPage = m.route.get().split('?')[0].startsWith('/t/');
		let tagId;
		if (isTagPage) {
			const slug = m.route.get().split('/t/')[1]?.split('?')[0];
			tagId = app.store.all('tags').find(t => t.slug() === slug).data.id;
			const tag = app.store.all('tags').find(t => t.id() === tagId);
			const tagSettings = tag ? JSON.parse(tag.data.attributes.walsgitDiscussionCardsTagSettings || '{}') : {};
			const tagImage = tag ? tag.data.attributes.walsgitDiscussionCardsTagDefaultImage : null;
			tagSettings.defaultImage = tagImage;

			for (const key in tagSettings) {
				if (settings.hasOwnProperty(key) && tagSettings[key] !== settings[key] && tagSettings[key] !== null) {
					settings[key] = tagSettings[key];
				}
			}
		}
		/* On the IndexPage (all discussions) checks which default image to show based on tag priority */
		const isIndexPage = m.route.get().split('?')[0] === '/';
		if (isIndexPage) {
			const tags = discussion.tags();
			for (const key in tags) {
				const tagId = tags[key].id();
				const isChild = tags[key].isChild();
				const parent = tags[key].data.hasOwnProperty('relationships') && tags[key].parent() ? tags[key].parent()['data'].id : null;
				const position = tags[key].position();
				const tagCustomImg = tags[key].attribute('walsgitDiscussionCardsTagDefaultImage');
				const currentTag = { id: tagId, isChild, parent, position, tagCustomImg }
				let priorityTag = null;
				if (!settings.allowedTags.includes(tagId) || tagCustomImg === null) continue;

				if (priorityTag === null || compareTags(currentTag, priorityTag) < 0) {
					priorityTag = { id: tagId, isChild, parent, position, tagCustomImg };
					settings.defaultImage = tagCustomImg;
				}
			}
		}

		const isRead = Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user ? "read" : "";
		const attrs = {};
		attrs.className =
			"wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : "");
		const image = getPostImage(discussion.firstPost(), settings.defaultImage);
		const media = image ? (
			<img
				src={image}
				className="previewCardImg"
				alt={discussion.title()}
				loading="lazy"
			/>
		) : (
			<div className="imgStub" />
		);

		return (
			<div
				key={discussion.id()}
				data-id={discussion.id()}
				data-tag-id={isTagPage ? tagId : null}
				className={
					"CardsListItem Card " +
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
							DiscussionControls.controls(
								discussion,
								this
							).toArray()
						)
					: ""}
				<Link
					href={app.route.discussion(discussion, 0)}
					className="cardLink"
				>
					{Number(settings.showBadges) === 1
						? craftBadges(discussion.badges().toArray())
						: ""}

					<div {...attrs}>
						{console.log(discussion.data.attributes.hasOwnProperty('views'))}
						{discussion.data.attributes.hasOwnProperty('views') && (
							<>
								{Number(settings.showViews) === 1 &&
								!isNaN(discussion.views()) ? (
									<div className="imageLabel discussionViews">
										{icon("fas fa-eye", { className: "labelIcon" })}
										{discussion.views()}
									</div>
								) : (
									""
								)}
							</>
						)}

						{media}

						{Number(settings.showAuthor) === 1 ? (
							<div className="cardFoot">
								<div className="Author">
									{username(discussion.user())}
								</div>
								<div className="Date">
									{humanTime(discussion.createdAt())}
								</div>
							</div>
						) : (
							""
						)}
					</div>

					<div className="cardTags">
						{craftTags(discussion.tags())}
					</div>
					<div className="cardTitle">
						<h2>{discussion.title()}</h2>
					</div>
					{Number(settings.previewText) === 1 && discussion.firstPost() ? (
						<div className="previewPost">
							{truncate(
								discussion.firstPost().contentPlain(),
								150
							)}
						</div>
					) : (
						""
					)}

					{Number(settings.showReplies) === 1 ? (
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
										{m(LastReplies, {
											discussion: discussion,
										})}
									</div>
									<div className="Repcount">
										{app.translator.trans(
											"walsgit_discussion_cards.forum.replies",
											{
												count:
													discussion.replyCount() ||
													"0",
											}
										)}
									</div>
								</div>
								<div className="Arrow">
									{icon("fas fa-angle-right")}
								</div>
							</Link>
						</div>
					) : (
						""
					)}
				</Link>
			</div>
		);
	}
}
