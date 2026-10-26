/*
 * Component that displays the card image of the discussion cards
 */
import Component from "flarum/common/Component";
import humanTime from "flarum/common/utils/humanTime";
import username from "flarum/common/helpers/username";
import Icon from "flarum/common/components/Icon";

export default class DiscussionMedia extends Component {
  view(vnode) {
    const { discussion, settings } = this.attrs;
    const imageUrl = discussion.attribute("cardImageUrl") || null;

    // optional data to show on top of image
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
        {imageUrl ? (
          <img
            src={imageUrl}
            className="dc-preview-card-img"
            alt={discussion.title()}
            loading="lazy"
          />
        ) : (
          // fallback to Discussion Cards' extension default image
          <div className="dc-img-stub" />
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
