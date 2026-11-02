import { extend, override } from "flarum/common/extend";
import app from "flarum/forum/app";
import DiscussionList from "flarum/forum/components/DiscussionList";
import DiscussionListItem from "flarum/forum/components/DiscussionListItem";
import IndexPage from "flarum/forum/components/IndexPage";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";
import Placeholder from "flarum/common/components/Placeholder";
import Button from "flarum/common/components/Button";
import CardItem from "./components/CardItem";
import ListItem from "./components/ListItem";
import checkOverflowingContent from "./helpers/checkOverflowingContent";
import Post from "flarum/common/models/Post";
import Discussion from "flarum/common/models/Discussion";
import DiscussionControls from "flarum/forum/utils/DiscussionControls";
import BaseItem from "./components/common/BaseItem";

/**
 * Parse the allowed tags setting (JSON string) into an array of tag ids as strings.
 * Returns an empty array if the value is missing or invalid.
 */
function parseAllowedTags(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Return a card width (percentage) usable in a CSS variable, or undefined
 * if the value is missing or outside the 10-100 range (the LESS fallback applies).
 */
function cardWidthVar(value) {
  const width = Number(value);
  return Number.isFinite(width) && width >= 10 && width <= 100
    ? width + "%"
    : undefined;
}

app.initializers.add(
  "walsgit/discussion/cards",
  () => {
    extend(DiscussionList.prototype, "oncreate", checkOverflowingContent);
    extend(DiscussionList.prototype, "onupdate", checkOverflowingContent);

    override(DiscussionList.prototype, "view", function (original) {
      const settings = {};
      for (const key in app.forum.data.attributes) {
        if (key.startsWith("walsgitDiscussionCards")) {
          let newKey = key.replace("walsgitDiscussionCards", "");
          newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
          settings[newKey] = app.forum.data.attributes[key];
        }
      }
      const state = this.attrs.state;
      const params = state.getParams();
      let loading;
      if (state.isInitialLoading() || state.isLoadingNext()) {
        loading = <LoadingIndicator />;
      } else if (state.hasNext()) {
        loading = Button.component(
          {
            className: "Button",
            onclick: state.loadNext.bind(state),
          },
          app.translator.trans("core.forum.discussion_list.load_more_button")
        );
      }
      if (state.isEmpty()) {
        const text = app.translator.trans(
          "core.forum.discussion_list.empty_text"
        );
        return <div className="DiscussionList">{m(Placeholder, { text })}</div>;
      }
      const allowedTags = parseAllowedTags(settings.allowedTags);
      const isTagPage = m.route.get().split("?")[0].startsWith("/t/");
      let tag = null;
      if (isTagPage) {
        const currentTag = app.store
          .all("tags")
          .find((t) => t.slug() === params.tags);

        // If the tag isn't in the store (yet), we simply fall back to Flarum's default list
        if (currentTag) {
          tag = String(currentTag.id());

          let tagSettings = null;
          try {
            tagSettings = JSON.parse(
              currentTag.attribute("walsgitDiscussionCardsTagSettings")
            );
          } catch (e) {
            // invalid or missing tag settings: keep the global ones
          }

          for (const key in tagSettings) {
            if (
              settings.hasOwnProperty(key) &&
              tagSettings[key] !== settings[key]
            ) {
              settings[key] = tagSettings[key];
            }
          }
        }
      }
      if (
        app.current.matches(IndexPage) &&
        ((tag !== null && allowedTags.includes(tag)) ||
          (!params.tags && Number(settings.onIndexPage) === 1))
      ) {
        const useListCards = Number(settings.useListCards) === 1;
        const listCardsCount = Number(settings.listCardsCount);

        return (
          <div
            className={
              "DiscussionList" +
              (state.isSearchResults() ? " DiscussionList--searchResults" : "")
            }
          >
            {/* Card Items (primary card) */}
            <div
              class="DiscussionList-discussions dc-primary-cards"
              style={{
                "--dc-desktop-card-width": cardWidthVar(
                  settings.desktopCardWidth
                ),
                "--dc-tablet-card-width": cardWidthVar(settings.tabletCardWidth),
              }}
            >
              {state
                .getPages()
                .map((pg, o) =>
                  pg.items
                    .filter(
                      (d, i) => o === 0 && i < Number(settings.primaryCards)
                    )
                    .map((discussion) =>
                      m(CardItem, { key: discussion.id(), discussion })
                    )
                )}
            </div>

            {/* List Items */}
            <div class="DiscussionList-discussions">
              {state.getPages().map((pg, o) => {
                // Skip primary cards
                const secondaryItems = pg.items.filter(
                  (d, i) => !(o === 0 && i < Number(settings.primaryCards))
                );

                return secondaryItems.map((discussion, idx) => {
                  // Only if useListCards === 1 && (idx < listCardsCount OR listCardsCount = 0)
                  const showCard =
                    useListCards &&
                    (listCardsCount === 0 || idx < listCardsCount);

                  return showCard
                    ? m(ListItem, { key: discussion.id(), discussion })
                    : m(DiscussionListItem, {
                        key: discussion.id(),
                        discussion,
                        params: app.search?.state?.params() ?? {},
                      });
                });
              })}
            </div>
            <div className="DiscussionList-loadMore">{loading}</div>
          </div>
        );
      } else {
        return original();
      }
    });
  },
  -1
);

/**
 * Reload a discussion from the API to get its up-to-date card image URL
 */
function refreshCardImage(discussion) {
  return app.store
    .find("discussions", discussion.id(), {})
    .then((freshDiscussion) => {
      discussion.pushAttributes({
        cardImageUrl: freshDiscussion.attribute("cardImageUrl") || null,
      });
      m.redraw();
    })
    .catch((error) => {
      console.error(
        app.translator.trans(
          "walsgit_discussion_cards.forum.console.postUpdateCardImageError"
        ),
        error
      );
    });
}

/**
 * Refresh card image after first post edition
 */
extend(
  Post.prototype,
  "save",
  function (promise) {
    promise.then((updatedPost) => {
      // first post only
      if (updatedPost.number() !== 1) {
        return;
      }

      const discussion = updatedPost.discussion();

      if (discussion && discussion.id()) {
        refreshCardImage(discussion);
      }
    });
  },
  100
);

/**
 * Refresh card image after first post deletion (when the discussion itself remains)
 */
extend(Post.prototype, "delete", function (promise) {
  if (this.number() !== 1) {
    return;
  }

  const discussion = this.discussion();

  // Same rule as Flarum core: if no post is left, the whole discussion is considered deleted
  if (!discussion || discussion.postIds().length <= 1) {
    return;
  }

  promise.then(() => refreshCardImage(discussion)).catch(() => {});
});

/**
 * Ids of the discussions whose card image is being regenerated (prevents double clicks)
 */
const regeneratingImages = new Set();

/**
 * Ask the server to regenerate the card image of a discussion and update its card
 */
function regenerateCardImage(discussion) {
  const id = discussion.id();

  if (regeneratingImages.has(id)) {
    return;
  }

  regeneratingImages.add(id);
  m.redraw();

  // Without the client-side "?r=" added by a previous regeneration
  const previousUrl = (discussion.attribute("cardImageUrl") || "").replace(
    /[?&]r=\d+$/,
    ""
  );

  app
    .request({
      method: "POST",
      url:
        app.forum.attribute("apiUrl") +
        "/walsgit/discussion-cards/regenerate-image/" +
        id,
    })
    .then((response) => {
      // response.status: "regenerated", "unchanged" or "no_image" (RegenerateImagesService::STATUS_*)
      // Nothing to do: leave the card as it is
      if (response.status === "unchanged") {
        app.alerts.show(
          { type: "success" },
          app.translator.trans(
            "walsgit_discussion_cards.forum.regenerateImageUnchanged"
          )
        );
        return;
      }

      let url = response.cardImageUrl || null;

      // Same URL (e.g. file recreated under the same name): add a client-side query string so the
      // card retries the image (it shows its stub for a URL that failed) and the browser cache is bypassed
      if (url !== null && url === previousUrl) {
        url += (url.includes("?") ? "&" : "?") + "r=" + Date.now();
      }

      discussion.pushAttributes({ cardImageUrl: url });

      const key =
        response.status === "no_image"
          ? "regenerateImageNoImage"
          : "regenerateImageDone";

      app.alerts.show(
        { type: response.status === "no_image" ? "warning" : "success" },
        app.translator.trans("walsgit_discussion_cards.forum." + key)
      );
    })
    .catch((error) => {
      console.error(
        app.translator.trans(
          "walsgit_discussion_cards.forum.regenerateImageError"
        ),
        error
      );
      app.alerts.show(
        { type: "error" },
        app.translator.trans(
          "walsgit_discussion_cards.forum.regenerateImageError"
        )
      );
    })
    .finally(() => {
      regeneratingImages.delete(id);
      m.redraw();
    });
}

/**
 * Adds a "Regenerate card image" item in the menu of the cards (admins only)
 */
extend(
  DiscussionControls,
  "moderationControls",
  function (items, discussion, context) {
    if (!app.session.user?.isAdmin() || !(context instanceof BaseItem)) {
      return;
    }

    const loading = regeneratingImages.has(discussion.id());

    items.add(
      "walsgitRegenerateCardImage",
      <Button
        icon="fas fa-image"
        loading={loading}
        disabled={loading}
        onclick={() => regenerateCardImage(discussion)}
      >
        {app.translator.trans("walsgit_discussion_cards.forum.regenerateImage")}
      </Button>
    );
  }
);

// Allow flarum to discover modules
import "./forum";
