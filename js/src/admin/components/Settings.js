import app from "flarum/admin/app";
import ExtensionPage from "flarum/admin/components/ExtensionPage";
import UploadImageButton from 'flarum/admin/components/UploadImageButton';
import isExtensionInstalled from "../helpers/isExtensionInstalled";
import isExtensionActive from "../helpers/isExtensionActive";
import icon from "flarum/common/helpers/icon";

export default class Settings extends ExtensionPage {
	content() {
		/* Supported third party extensions' info */
		const viewsExtension = {
			id: 'flarumite-simple-discussion-views',
			name: 'Flarumite Simple Discussion Views',
			url: 'https://flarum.org/extension/flarumite/simple-discussion-views',
		};
		const mbViewsExtension = {
			id: 'michaelbelgium-discussion-views',
			name: 'michaelbelgium/flarum-discussion-views',
			url: 'https://flarum.org/extension/michaelbelgium/flarum-discussion-views',
		};
		const blogExtension = {
			id: 'v17development-blog',
			name: 'Flarum Blog',
			url: 'https://flarum.org/extension/v17development/flarum-blog',
		};
		const repostExtension = {
			id: 'shebaoting-repost',
			name: 'Repost',
			url: 'https://flarum.org/extension/shebaoting/repost',
		};

		const warningIcon = icon("fas fa-exclamation-triangle");

		return (
			<div className="DiscussionCardsSettings">
				<div className="container">
					<div className="DiscussionCardsSettings--content">
						<h3>{app.translator.trans("walsgit_discussion_cards.admin.settings.general.where_title")}</h3>
						<p className="helpText">
							{app.translator.trans("walsgit_discussion_cards.admin.settings.general.where_info")}
						</p>
						<div className="Section">
							{this.buildSettingComponent({
								type: "flarum-tags.select-tags",
								setting: "walsgit_discussion_cards_allowedTags",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.allowedTags_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.allowedTags_help"),
								options: {
									requireParentTag: false,
								},
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_onIndexPage",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.onIndexPage_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.onIndexPage_help"),
							})}
						</div>
						<h3>{app.translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCardOptions_title")}</h3>
						<p className="helpText">
							{app.translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCardOptions_info")}
						</p>
						<div className="Section">
							{this.buildSettingComponent({
								type: "number",
								className: 'DC-Number',
								setting: "walsgit_discussion_cards_primaryCards",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCards_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCards_help"),
								min: 0,
								step: 1,
								placeholder: 4,
							})}
							{this.buildSettingComponent({
								type: "number",
								className: 'DC-Number',
								setting: "walsgit_discussion_cards_desktopCardWidth",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.desktopCardWidth_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.desktopCardWidth_help"),
								min: 10,
								max: 100,
								step: 1,
								placeholder: 49,
							})}
							{this.buildSettingComponent({
								type: "number",
								className: 'DC-Number',
								setting: "walsgit_discussion_cards_tabletCardWidth",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.tabletCardWidth_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.tabletCardWidth_help"),
								min: 10,
								max: 100,
								step: 1,
								placeholder: 49,
							})}
						</div>
						<h3>{app.translator.trans("walsgit_discussion_cards.admin.settings.general.cardOptions_title")}</h3>
						<p className="helpText">
							{app.translator.trans("walsgit_discussion_cards.admin.settings.general.cardOptions_info")}
						</p>
						<div className="Section">
							<div className="DC-DefaultImageSettings">
								<h4>{app.translator.trans("walsgit_discussion_cards.admin.settings.general.defaultImage_title")}</h4>
								<p className="helpText">
									{app.translator.trans("walsgit_discussion_cards.admin.settings.general.defaultImage_info")}
								</p>
								{app.forum.attribute("walsgitDiscussionCardsDefaultImage") === null 
									? <div className="imgStub"></div> 
									: <img className="DC-UserUploadedImage" src={app.forum.attribute("baseUrl") + "/assets/" + app.forum.attribute("walsgitDiscussionCardsDefaultImage")}/>
								}
								{m(UploadImageButton, {name: "walsgit_discussion_cards_default_image", class: "DC-UploadImageBtn"})}
							</div>
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_previewText",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.previewText_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.previewText_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showAuthor",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showAuthor_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showAuthor_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showReplies",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showReplies_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showReplies_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showRepliesOnRight",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showRepliesOnRight_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showRepliesOnRight_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showLastPostInfo",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showLastPostInfo_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showLastPostInfo_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showBadges",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showBadges_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showBadges_help"),
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_markReadCards",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.markReadCards_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.markReadCards_help"),
							})}							
						</div>
						{/* 3rd party extensions options */}
						<h3>{app.translator.trans("walsgit_discussion_cards.admin.settings.general.otherOptions_title")}</h3>
						<p className="helpText">
							{app.translator.trans("walsgit_discussion_cards.admin.settings.general.otherOptions_info")}
						</p>
						{/* flarumite/simple-discussion-views OR michaelbelgium/flarum-ext-discussion-views */}
						<div className="Section">
							<h4>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_start")}
								<a href={viewsExtension.url} target="_blank" rel="noopener noreferrer">{viewsExtension.name}</a>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_or")}
								<a href={mbViewsExtension.url} target="_blank" rel="noopener noreferrer">{mbViewsExtension.name}</a>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_end")}
							</h4>
							<div className="helpText">
								<em>
									{!isExtensionInstalled(viewsExtension.id) && !isExtensionInstalled(mbViewsExtension.id)
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.viewsExtension_notInstalled", {icon: warningIcon}) : 
									(isExtensionInstalled(viewsExtension.id) && !isExtensionActive(viewsExtension.id)) || (isExtensionInstalled(mbViewsExtension.id) && !isExtensionActive(mbViewsExtension.id)) 
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.viewsExtension_notActivated", {icon: warningIcon}) :
									''}
								</em>
							</div>
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_showViews",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_help"),
								disabled: isExtensionActive(viewsExtension.id) || isExtensionActive(mbViewsExtension.id) ? false : true,
							})}
							<hr></hr>
							{/* v17development/flarum-blog */}
							<h4>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_title_start")}
								<a href={blogExtension.url} target="_blank" rel="noopener noreferrer">{blogExtension.name}</a>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_title_end")}
							</h4>
							<div className="helpText">
								<em>
									{!isExtensionInstalled(blogExtension.id) 
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_notInstalled", {icon: warningIcon}) : 
									!isExtensionActive(blogExtension.id) 
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_notActivated", {icon: warningIcon}) :
									''}
								</em>
							</div>
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_useBlogImages",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogImages_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogImages_help"),
								disabled: isExtensionActive(blogExtension.id) ? false : true,
							})}
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_useBlogSummary",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogSummary_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogSummary_help"),
								disabled: isExtensionActive(blogExtension.id) ? false : true,
							})}
							<hr></hr>
							{/* shebaoting/repost */}
							<h4>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_title_start")}
								<a href={repostExtension.url} target="_blank" rel="noopener noreferrer">{repostExtension.name}</a>
								{app.translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_title_end")}
							</h4>
							<div className="helpText">
								<em>
									{!isExtensionInstalled(repostExtension.id) 
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_notInstalled", {icon: warningIcon}) : 
									!isExtensionActive(repostExtension.id) 
									? app.translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_notActivated", {icon: warningIcon}) :
									''}
								</em>
							</div>
							{this.buildSettingComponent({
								type: "switch",
								setting: "walsgit_discussion_cards_allowRepostLinks",
								label: app.translator.trans("walsgit_discussion_cards.admin.settings.general.allowRepostLinks_label"),
								help: app.translator.trans("walsgit_discussion_cards.admin.settings.general.allowRepostLinks_help"),
								disabled: isExtensionActive(repostExtension.id) ? false : true,
							})}
						</div>
						{this.submitButton()}
					</div>
				</div>
			</div>
		);
	}

	onsubmit() {
		const primaryCards = Number(this.setting('walsgit_discussion_cards_primaryCards')());
		const desktopCardWidth = Number(this.setting('walsgit_discussion_cards_desktopCardWidth')());
		const tabletCardWidth = Number(this.setting('walsgit_discussion_cards_tabletCardWidth')());

        if (primaryCards < 0 || isNaN(primaryCards)) {
            app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.primaryCards'));
            return false;
        }
        if (desktopCardWidth < 10 || desktopCardWidth > 100 || isNaN(desktopCardWidth)) {
            app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.desktopCardWidth'));
            return false;
        }
        if (tabletCardWidth < 10 || tabletCardWidth > 100 || isNaN(tabletCardWidth)) {
            app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.tabletCardWidth'));
            return false;
        }

        return true;
    }

	saveSettings(e) {
        if (!this.onsubmit()) {
            return;
        }
		const settings = this.dirty();

        super.saveSettings(e)
		.then(() => {
			const newSettings = {};
			for (const key in settings) {
				let endOfKey = key.replace('walsgit_discussion_cards_', '');
				endOfKey = endOfKey.replace(/^./, endOfKey.charAt(0).toUpperCase());
				const newKey = 'walsgitDiscussionCards' + endOfKey;
				newSettings[newKey] = settings[key];
			}
			app.forum.pushAttributes(newSettings);
			})
			.catch((error) => {
				console.error(error);
			});
    }
}
