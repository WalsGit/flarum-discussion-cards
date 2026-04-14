import app from 'flarum/app';
import { extend, override } from 'flarum/extend';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import IndexPage from 'flarum/forum/components/IndexPage';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import Button from 'flarum/common/components/Button';
import CardItem from './components/CardItem';
import ListItem from './components/ListItem';
import checkOverflowingContent from './helpers/checkOverflowingContent';
import Post from 'flarum/common/models/Post';
import Discussion from 'flarum/common/models/Discussion';

app.initializers.add(
  'walsgit/discussion/cards',
  () => {
    extend(DiscussionList.prototype, 'oncreate', checkOverflowingContent);
    extend(DiscussionList.prototype, 'onupdate', checkOverflowingContent);

    override(DiscussionList.prototype, 'view', function (original) {
      const settings = {};
      for (const key in app.forum.data.attributes) {
        if (key.startsWith('walsgitDiscussionCards')) {
          let newKey = key.replace('walsgitDiscussionCards', '');
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
            className: 'Button',
            onclick: state.loadNext.bind(state),
          },
          app.translator.trans('core.forum.discussion_list.load_more_button')
        );
      }
      if (state.isEmpty()) {
        const text = app.translator.trans('core.forum.discussion_list.empty_text');
        return <div className="DiscussionList">{m(Placeholder, { text })}</div>;
      }
      const isTagPage = m.route.get().split('?')[0].startsWith('/t/');
      let tag = null;
      if (isTagPage) {
        tag = app.store.all('tags').find((t) => t.slug() === params.tags).data.id;
        const tagSettings = JSON.parse(app.store.all('tags').find((t) => t.slug() === params.tags).data.attributes.walsgitDiscussionCardsTagSettings);
        for (const key in tagSettings) {
          if (settings.hasOwnProperty(key) && tagSettings[key] !== settings[key]) {
            settings[key] = tagSettings[key];
          }
        }
      }
      if (
        app.current.matches(IndexPage) &&
        ((settings.allowedTags.length && settings.allowedTags.includes(tag)) || (!params.tags && Number(settings.onIndexPage) === 1))
      ) {
        const useListCards = Number(settings.useListCards) === 1;
        const listCardsCount = Number(settings.listCardsCount);

        return (
          <div className={'DiscussionList' + (state.isSearchResults() ? ' DiscussionList--searchResults' : '')}>
            {/* Card Items (primary card) */}
            <div class="DiscussionList-discussions flexCard">
              {state
                .getPages()
                .map((pg, o) =>
                  pg.items.filter((d, i) => o === 0 && i < Number(settings.primaryCards)).map((discussion) => m(CardItem, { discussion }))
                )}
            </div>

            {/* List Items */}
            <div class="DiscussionList-discussions">
              {state.getPages().map((pg, o) => {
                // Skip primary cards
                const secondaryItems = pg.items.filter((d, i) => !(o === 0 && i < Number(settings.primaryCards)));

                return secondaryItems.map((discussion, idx) => {
                  // Only if useListCards === 1 && (idx < listCardsCount OR listCardsCount = 0)
                  const showCard = useListCards && (listCardsCount === 0 || idx < listCardsCount);

                  return showCard
                    ? m(ListItem, { discussion })
                    : m(DiscussionListItem, {
                        discussion,
                        params: app.search?.params() ?? {},
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
 * Refresh card image after first post edition
 */
extend(
  Post.prototype,
  'save',
  function (promise) {
    promise.then((updatedPost) => {
      // first post only
      if (updatedPost.number() !== 1) {
        return;
      }

      /** @type {Discussion} */
      const discussion = updatedPost.discussion();

      if (discussion && discussion.id()) {
        app.store
          .find('discussions', discussion.id(), {})
          .then((newDiscussionModel) => {
            const newImageUrl = newDiscussionModel.attribute('cardImageUrl');

            if (newImageUrl) {
              discussion.pushAttributes({
                cardImageUrl: newImageUrl,
              });
              m.redraw();
            }
          })
          .catch((error) => {
            console.error(app.translator.trans('walsgit_discussion_cards.forum.console.postUpdateCardImageError'), error);
          });
      }
    });
  },
  100
);

// Allow flarum to discover modules
import './forum';
