import app from "flarum/admin/app";
import { extend } from "flarum/common/extend";
import Settings from "../components/Settings";
import Button from "flarum/common/components/Button";
import Icon from "flarum/common/components/Icon";
import EditTagModal from "ext:flarum/tags/admin/components/EditTagModal";
import WdcTagSettingsModal from "../components/WdcTagSettingsModal";
import TagUploadImageButton from "../components/TagUploadImageButton";

export default function extendEditTagModal() {
  extend(EditTagModal.prototype, "fields", function (items) {
    if (this.tag.id()) {
      let allowedTags = JSON.parse(
        app.forum.attribute("walsgitDiscussionCardsAllowedTags")
      );
      let isActivatedForTag = allowedTags
        .map(String)
        .includes(String(this.tag.id()));

      let activationBtnClasses = isActivatedForTag
        ? "dc-activation-btn Button dc-activated"
        : "dc-activation-btn Button Button--primary";
      let DcTagSettingsClasses = isActivatedForTag
        ? "dc-tag-settings"
        : "dc-tag-settings dc-hidden";
      let activationBtnText = isActivatedForTag
        ? app.translator.trans(
            "walsgit_discussion_cards.admin.tags.deactivation_button"
          )
        : app.translator.trans(
            "walsgit_discussion_cards.admin.tags.activation_button"
          );

      const tagDefaultImage =
        app.store.data.tags[this.tag.id()].data.attributes
          .walsgitDiscussionCardsTagDefaultImage;
      const baseUrl = app.forum.attribute("baseUrl");
      const ImageFolderUrl =
        baseUrl + "/assets/extensions/walsgit-discussion-cards/";

      const toggleActivation = () => {
        isActivatedForTag = !isActivatedForTag;
        if (isActivatedForTag) {
          allowedTags.push(this.tag.id());
        } else {
          allowedTags = allowedTags.filter((id) => id !== this.tag.id());
        }

        app
          .request({
            method: "POST",
            url:
              app.forum.attribute("apiUrl") +
              "/walsgit/discussion-cards/tag-update-allowed-tags",
            body: { allowedTags },
          })
          .then(() => {
            app.forum.data.attributes.walsgitDiscussionCardsAllowedTags =
              JSON.stringify(allowedTags);
            app.data.settings.walsgit_discussion_cards_allowedTags =
              JSON.stringify(allowedTags);

            isActivatedForTag = !isActivatedForTag;
            activationBtnClasses = isActivatedForTag
              ? "dc-activation-btn Button dc-activated"
              : "dc-activation-btn Button Button--primary";
            DcTagSettingsClasses = isActivatedForTag
              ? "dc-tag-settings"
              : "dc-tag-settings dc-hidden";
            activationBtnText = isActivatedForTag
              ? app.translator.trans(
                  "walsgit_discussion_cards.admin.tags.deactivation_button"
                )
              : app.translator.trans(
                  "walsgit_discussion_cards.admin.tags.activation_button"
                );
            m.redraw();
          });
      };

      items.add(
        "tag-discussion-cards-options",
        <fieldset className="dc-fieldset">
          <legend>
            {app.translator.trans(
              "walsgit_discussion_cards.admin.tags.options_heading"
            )}
          </legend>

          <Button
            className={activationBtnClasses}
            icon="fas fa-border-all"
            onclick={toggleActivation}
          >
            {activationBtnText}
          </Button>

          <div className={DcTagSettingsClasses}>
            <div className="dc-tag-default-image-settings">
              <h4>
                {app.translator.trans(
                  "walsgit_discussion_cards.admin.tags.defaultImage_title"
                )}
              </h4>
              <p className="helpText">
                {app.translator.trans(
                  "walsgit_discussion_cards.admin.tags.defaultImage_info"
                )}
              </p>
              <TagUploadImageButton
                name="walsgit_discussion_cards_tag_default_image"
                routePath={
                  "walsgit/discussion-cards/tag-default-image/" + this.tag.id()
                }
                value={tagDefaultImage ? ImageFolderUrl + tagDefaultImage : ""}
                url={ImageFolderUrl + tagDefaultImage}
                className="dc-upload-tag-image-btn"
              />
            </div>
            <Button
              className="Button Button--primary"
              icon="fas fa-border-all"
              onclick={() => {
                app.modal.show(WdcTagSettingsModal, { model: this.tag });
              }}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.tags.options_button"
              )}
            </Button>
          </div>
        </fieldset>,
        -20
      );
    }
  });
}
