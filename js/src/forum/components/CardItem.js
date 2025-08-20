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
import isValideImageUrl from "../helpers/isValideImageUrl";
import TerminalPost from 'flarum/components/TerminalPost';

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

		/* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
		const viewsActivated = 'flarumite-simple-discussion-views' in flarum.extensions;
		const isViewsSet = discussion.data.attributes.hasOwnProperty('views');

		const mbViewsActivated = 'michaelbelgium-discussion-views' in flarum.extensions;
		const isViewCountSet = discussion.data.attributes.hasOwnProperty('viewCount');

		const viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;

		/* Getting & setting relevant info for 3rd party Flarum Blog extension support */
		const blogActivated = app.forum.data.attributes.hasOwnProperty('blogTags');
		const blogSettings = {};
		const postIsBlogType = discussion.data.relationships.hasOwnProperty('blogMeta');
		const blogPost = {}
		if(blogActivated) {
			blogSettings.tags = app.forum.attribute('blogTags');
			blogSettings.defaultImage = app.forum.attribute('blogDefaultImage');

			if(postIsBlogType) {
				const blogPostsData = discussion.store.data.blogMeta[discussion.data.relationships.blogMeta.data.id];
				if(isValideImageUrl(blogPostsData.attribute('featuredImage'))) {
					blogPost.featuredImage = blogPostsData.attribute('featuredImage');					
				}
			}
		}

		/* Getting & setting relevant info for 3rd party Repost extension */
		const repostActivated = 'shebaoting-repost' in flarum.extensions;
		const repostUrl = discussion.data.attributes.original_url || null;

		const isTagPage = m.route.get().split('?')[0].startsWith('/t/');
		let tagId;
		if (isTagPage) {
			const slug = m.route.get().split('/t/')[1]?.split('?')[0];
			tagId = app.store.all('tags').find(t => t.slug() === slug).data.id;
			const tag = app.store.all('tags').find(t => t.id() === tagId);
			const tagSettings = tag ? JSON.parse(tag.data.attributes.walsgitDiscussionCardsTagSettings || '{}') : {};
			const tagImage = tag ? tag.data.attributes.walsgitDiscussionCardsTagDefaultImage : null;
			
			tagSettings.defaultImage = tagImage;
			/* In case Flarum Blog Extension and useBlogImage are activated  */
			if(blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(tagId)) {
				tagSettings.defaultImage = postIsBlogType && blogPost.featuredImage && isValideImageUrl(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
			}

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

				let tagCustomImg = tags[key].attribute('walsgitDiscussionCardsTagDefaultImage');
				/* In case Flarum Blog Extension and useBlogImage are activated  */
				if(blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(tagId)) {
					tagCustomImg = postIsBlogType && blogPost.featuredImage && isValideImageUrl(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
				}

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
		const image = getPostImage(discussion.firstPost(), settings.defaultImage, postIsBlogType);
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

		/* Jump to the last relevant post (first unread or last post) */
		const jumpTo = Math.min(discussion.lastPostNumber() ?? 0, (discussion.lastReadPostNumber() || 0) + 1);

		/* setting post counts & text */
		const replyText = discussion.unreadCount() 
			? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", { count: discussion.unreadCount()} ) 
			: app.translator.trans("walsgit_discussion_cards.forum.replies", { count: discussion.replyCount() || "0"} );

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
					href={app.route.discussion(discussion, jumpTo)}
					className="cardLink"
				>
					{Number(settings.showBadges) === 1
						? craftBadges(discussion.badges().toArray())
						: ""}

					<div {...attrs}>
						{(isViewsSet || isViewCountSet) && (
							<>
								{Number(settings.showViews) === 1 &&
								!isNaN(viewsCount) ? (
									<div className="imageLabel discussionViews">
										{icon("fas fa-eye", { className: "labelIcon" })}
										{viewsCount}
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
						<h2 title={discussion.title()} className="title">
							{Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? <a href={repostUrl} onclick={(e) => e.stopPropagation()}>{truncate(discussion.title(), 80)}</a> : truncate(discussion.title(), 80)}
						</h2>
					</div>
					{Number(settings.previewText) === 1 && discussion.firstPost() ? (
						<div className="previewPost">
							{blogActivated && Number(settings.useBlogSummary) === 1 && discussion.data.relationships.hasOwnProperty('blogMeta') && discussion.blogMeta().summary() !== ''
								? truncate(discussion.blogMeta().summary(), 150)
								: truncate(discussion.firstPost().contentPlain(), 150)
							}
						</div>
					) : (
						""
					)}

					{Number(settings.showLastPostInfo) === 1 && discussion.firstPost() ? (
						<div className="terminalPost">
						<TerminalPost discussion={discussion} lastPost={discussion.lastPostNumber()} />
						</div>
					) : (
						''
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
										{replyText}
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
