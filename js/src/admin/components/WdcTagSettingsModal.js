import Button from "flarum/common/components/Button";
import Modal from "flarum/common/components/Modal";
import Stream from "flarum/common/utils/Stream";

let defaultSettings = {};

export default class WdcTagSettingsModal extends Modal {
	oninit(vnode) {
		super.oninit(vnode);

		this.tagSettings = JSON.parse(this.attrs.model.data.attributes.walsgitDiscussionCardsTagSettings || null) || {};

		defaultSettings = {
			primaryCards: app.forum.data.attributes.walsgitDiscussionCardsPrimaryCards,
			desktopCardWidth: app.forum.data.attributes.walsgitDiscussionCardsDesktopCardWidth,
			tabletCardWidth: app.forum.data.attributes.walsgitDiscussionCardsTabletCardWidth,
		}
		
		if (!this.tagSettings.hasOwnProperty('primaryCards') || this.tagSettings.primaryCards === null) {
			this.tagSettings.primaryCards = defaultSettings.primaryCards;
		}
		if (!this.tagSettings.hasOwnProperty('desktopCardWidth') || this.tagSettings.desktopCardWidth === null) {
			this.tagSettings.desktopCardWidth = defaultSettings.desktopCardWidth;
		}
		if (!this.tagSettings.hasOwnProperty('tabletCardWidth') || this.tagSettings.tabletCardWidth === null) {
			this.tagSettings.tabletCardWidth = defaultSettings.tabletCardWidth;
		}

		this.tagSettings.primaryCards = Stream(this.tagSettings.primaryCards);
		this.tagSettings.desktopCardWidth = Stream(this.tagSettings.desktopCardWidth);
		this.tagSettings.tabletCardWidth = Stream(this.tagSettings.tabletCardWidth);
		
	}
	className() {
		return "WdcTagSettingsModal Modal--large";
	}

	title() {
		return [
			app.translator.trans("walsgit_discussion_cards.admin.tag_modal.title"),
			<span 
				className="TagLabel colored"
				style={"--tag-bg: " + this.attrs.model.data.attributes.color + ";"}
			>
				<span className="TagLabel-text">
					<span className="TagLabel-name">{this.attrs.model.data.attributes.name}</span>
				</span>
			</span>
		]
	}

	content() {
		return [
			<div className="Modal-body">
				<div className="Form">
					<p>
						{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.intro_text")}
					</p>
                        
					<div className="Form-group">
						<label htmlFor="primaryCards">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.primaryCards_label")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.primaryCards_help", {default: defaultSettings.primaryCards})}</div>
						<input
							type="number"
							name="primaryCards"
							className="FormControl DC-Number"
							bidi={this.tagSettings.primaryCards}
						/>
					</div>
					<div className="Form-group">
						<label htmlFor="desktopCardWidth">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.desktopCardWidth_label")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.desktopCardWidth_help", {default: defaultSettings.desktopCardWidth})}</div>
						<input
							type="number"
							name="desktopCardWidth"
							className="FormControl DC-Number"
							bidi={this.tagSettings.desktopCardWidth}
						/>
					</div>
					<div className="Form-group">
						<label htmlFor="tabletCardWidth">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.tabletCardWidth_label")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.tabletCardWidth_help", {default: defaultSettings.tabletCardWidth})}</div>
						<input
							type="number"
							name="tabletCardWidth"
							className="FormControl DC-Number"
							bidi={this.tagSettings.tabletCardWidth}
						/>
					</div>
					<Button
						type="submit"
						className="Button Button--primary"
						loading={this.loading}
						disabled={this.changed()}
					>
						{app.translator.trans("walsgit_discussion_cards.admin.tag_modal.submit_button")}
					</Button>
				</div>
			</div>,
		];
	}
	changed() {
		let savedSettings = JSON.parse(this.attrs.model.data.attributes.walsgitDiscussionCardsTagSettings || 'null') || {};

		function isSameSettings(obj1, obj2) {
			if(typeof obj1 !== 'object' ||typeof obj2 !== 'object') {
				return false;
			}

			if (Object.keys(obj1).length !== Object.keys(obj2).length) {
				return false;
			}
		
			for (const key in obj1) {
				if (obj1.hasOwnProperty(key)) {
					if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
						if (!compareObjects(obj1[key], obj2[key])) {
							return false;
						}
					} else if (obj1[key] !== obj2[key]) {
						return false;
					}
				}
			}
		
			return true;
		}

		return isSameSettings(JSON.parse(JSON.stringify(this.tagSettings)), savedSettings);
	}

	onsubmit(e) {
		e.preventDefault();

		const primaryCards = parseInt(this.tagSettings.primaryCards());
		if (isNaN(primaryCards) || primaryCards < 0) {
			app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.primaryCards'));
			return;
		}
	
		const desktopWidth = parseInt(this.tagSettings.desktopCardWidth());
		if (isNaN(desktopWidth) || desktopWidth < 10 || desktopWidth > 100) {
			app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.desktopCardWidth'));
			return;
		}
	
		const tabletWidth = parseInt(this.tagSettings.tabletCardWidth());
		if (isNaN(tabletWidth) || tabletWidth < 10 || tabletWidth > 100) {
			app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.tabletCardWidth'));
			return;
		}

		const tag = this.attrs.model;

		this.tagSettings.primaryCards(primaryCards);
		this.tagSettings.desktopCardWidth(desktopWidth);
		this.tagSettings.tabletCardWidth(tabletWidth);

		const tagSettings = JSON.stringify(this.tagSettings);

		this.loading = true;

		app.request({
			method: "PATCH",
			url:
				app.forum.attribute("apiUrl") +
				"/tags/" +
				tag.id() +
				"/tagSettings",
			body: { data: { tagSettings } },
		}).then(function () {
			tag.data.attributes.walsgitDiscussionCardsTagSettings = tagSettings;
			app.modal.close();
		});
	}
}
