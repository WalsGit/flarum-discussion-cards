import app from "flarum/app";
import Settings from "./components/Settings";
import { extend } from "flarum/extend";
import Model from "flarum/common/Model";
import Button from "flarum/common/components/Button";
import icon from 'flarum/common/helpers/icon';
import Tag from "flarum/tags/models/Tag";
import EditTagModal from "flarum/tags/components/EditTagModal";
import WdcTagSettingsModal from "./components/WdcTagSettingsModal";
import UploadTagImageButton from "./components/UploadTagImageButton";

app.initializers.add("walsgit/discussion-cards", () => {
	Tag.prototype.WdcDefaultImage = Model.attribute(
		"walsgit_discussion_cards_tag_default_image"
	);

	extend(EditTagModal.prototype, "fields", function (items) {
		if (this.tag.id()) {
			let allowedTags = JSON.parse(app.forum.attribute('walsgitDiscussionCardsAllowedTags'));
			let isActivatedForTag = allowedTags.includes(this.tag.id());
			
			let activationBtnClasses = isActivatedForTag
				? "DC-ActivationBtn Button activated"
				: "DC-ActivationBtn Button Button--primary";
			let DcTagSettingsClasses = isActivatedForTag ? "DC-TagSettings" : "DC-TagSettings DC-Hidden";
			let activationBtnText = isActivatedForTag
				? app.translator.trans("walsgit_discussion_cards.admin.tags.deactivation_button")
				: app.translator.trans("walsgit_discussion_cards.admin.tags.activation_button");
			
			const toggleActivation = () => {
				isActivatedForTag = !isActivatedForTag;
				if (isActivatedForTag) {
					allowedTags.push(this.tag.id());
				} else {
					allowedTags = allowedTags.filter(id => id !== this.tag.id());
				}

				app.request({
					method: "POST",
					url: app.forum.attribute("apiUrl") + "/walsgit_discussion_cards_tag_update_allowedTags",
					body: { allowedTags },
				}).then(() => {
					app.forum.data.attributes.walsgitDiscussionCardsAllowedTags = JSON.stringify(allowedTags);
					app.data.settings.walsgit_discussion_cards_allowedTags = JSON.stringify(allowedTags);

					isActivatedForTag = !isActivatedForTag;
					activationBtnClasses = isActivatedForTag
						? "DC-ActivationBtn Button activated"
						: "DC-ActivationBtn Button Button--primary";
					DcTagSettingsClasses = isActivatedForTag ? "DC-TagSettings" : "DC-TagSettings DC-Hidden";
					activationBtnText = isActivatedForTag
						? app.translator.trans("walsgit_discussion_cards.admin.tags.deactivation_button")
						: app.translator.trans("walsgit_discussion_cards.admin.tags.activation_button");
					m.redraw();
				});
			};
			
			items.add(
				"tag-discussion-cards-options",
				<fieldset className="DC-Fieldset">
					<legend>
						{app.translator.trans("walsgit_discussion_cards.admin.tags.options_heading")}
					</legend>

					<Button
						className={activationBtnClasses}
						icon="fas fa-border-all"
						onclick={toggleActivation}
					>
						{activationBtnText}
					</Button>
					
					<div className={DcTagSettingsClasses}>
						<div className="DC-TagDefaultImageSettings">
							<h4>
								{app.translator.trans("walsgit_discussion_cards.admin.tags.defaultImage_title")}
							</h4>
							<p className="helpText">
								{app.translator.trans("walsgit_discussion_cards.admin.tags.defaultImage_info")}
							</p>
							{m(UploadTagImageButton, {
								name: "walsgit_discussion_cards_tag_default_image",
								className: "DC-UploadTagImageBtn",
								ariaLabel: "Upload a default image for this tag",
								tagId: this.tag.id()
							})}
						</div>
						<Button
							className="Button Button--primary"
							icon="fas fa-border-all"
							onclick={() => {
								app.modal.show(WdcTagSettingsModal, { model: this.tag });
							}}
						>
							{app.translator.trans("walsgit_discussion_cards.admin.tags.options_button")}
						</Button>
					</div>
				</fieldset>,
				-20
			);
		}
	});

	app.extensionData.for("walsgit-discussion-cards").registerPage(Settings);
});
