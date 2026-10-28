/*
 * Component that displays the card image of the discussion cards
 */
import Component from "flarum/common/Component";
import humanTime from "flarum/common/utils/humanTime";
import username from "flarum/common/helpers/username";
import Icon from "flarum/common/components/Icon";
import Button from "flarum/common/components/Button";
import BrokenImagesModal from "../BrokenImagesModal";

const ALERT_DELAY = 1500;

const brokenDiscussions = new Map();
let alertTimer = null;
// Reset on every full page load, so the alert comes back until the images are fixed
let alertShown = false;

// Translator output with parameters is an array of parts: join it for the console
const text = (key, params) =>
  [].concat(app.translator.trans(key, params)).join("");

/**
 * Admins only: remember a card image that failed to load and warn once per page load
 * (one short aggregated alert with a details modal, not one per card)
 */
function reportBrokenImage(discussion, url) {
  if (!app.session.user || !app.session.user.isAdmin()) return;

  const id = discussion.id();
  if (brokenDiscussions.has(id)) return;
  brokenDiscussions.set(id, discussion);

  console.groupCollapsed(
    text("walsgit_discussion_cards.forum.console.brokenCardImage", { id })
  );
  console.warn(
    text("walsgit_discussion_cards.forum.console.brokenCardImageDetails", {
      url,
    })
  );
  console.groupEnd();

  if (alertShown) return;

  clearTimeout(alertTimer);
  alertTimer = setTimeout(() => {
    app.alerts.show(
      {
        type: "warning",
        controls: [
          <Button
            className="Button Button--link"
            onclick={() =>
              app.modal.show(BrokenImagesModal, {
                discussions: [...brokenDiscussions.values()],
              })
            }
          >
            {app.translator.trans(
              "walsgit_discussion_cards.forum.brokenImagesDetails"
            )}
          </Button>,
        ],
      },
      app.translator.trans("walsgit_discussion_cards.forum.brokenImagesAlert")
    );
    alertShown = true;
  }, ALERT_DELAY);
}

export default class DiscussionMedia extends Component {
  view(vnode) {
    const { discussion, settings } = this.attrs;
    const imageUrl = discussion.attribute("cardImageUrl") || null;
    // A new URL (like after a refresh) gets a new chance to load
    const imageFailed = imageUrl !== null && this.failedUrl === imageUrl;

    // Optional data to show on top of image
    const attrs = {
      className:
        "dc-wrap-img" +
        (Number(settings.showAuthor) === 1 ? " dc-wrap-img--shade" : ""),
    };

    // 3rd party "views" extensions support
    const viewsActivated = "fof-discussion-views" in flarum.extensions;
    const isViewsSet = discussion.data.attributes.hasOwnProperty("views");

    const mbViewsActivated =
      "michaelbelgium-discussion-views" in flarum.extensions;
    const isViewCountSet =
      discussion.data.attributes.hasOwnProperty("viewCount");

    const viewsCount =
      viewsActivated && isViewsSet
        ? discussion.views()
        : mbViewsActivated && isViewCountSet
        ? discussion.viewCount()
        : NaN;

    return (
      <div {...attrs}>
        {/* Optional: show Views */}
        {(isViewsSet || isViewCountSet) &&
          Number(settings.showViews) === 1 &&
          !isNaN(viewsCount) && (
            <div className="dc-image-label dc-image-label--views">
              <Icon name="fas fa-eye" className="dc-label-icon" />
              {viewsCount}
            </div>
          )}
        {/* Image */}
        {imageUrl && !imageFailed ? (
          <img
            src={imageUrl}
            className="dc-preview-card-img"
            alt={discussion.title()}
            loading="lazy"
            onerror={() => {
              this.failedUrl = imageUrl;
              reportBrokenImage(discussion, imageUrl);
              m.redraw();
            }}
          />
        ) : (
          // If no image, or it could not be loaded: fallback to Discussion Cards' stub
          <div className="dc-img-stub" aria-hidden="true" />
        )}
        {/* Optional: show author & date */}
        {Number(settings.showAuthor) === 1 && (
          <div className="dc-card-footer">
            <div className="dc-author">{username(discussion.user())}</div>
            <div className="dc-date">{humanTime(discussion.createdAt())}</div>
          </div>
        )}
      </div>
    );
  }
}
