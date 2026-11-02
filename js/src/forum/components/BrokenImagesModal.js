/*
 * Admin-only modal that details the discussions whose card image could not be loaded
 */
import app from "flarum/forum/app";
import Modal from "flarum/common/components/Modal";
import Link from "flarum/common/components/Link";

const MAX_LISTED = 20;

export default class BrokenImagesModal extends Modal {
  className() {
    return "dc-modal dc-broken-images-modal Modal--medium";
  }

  title() {
    return app.translator.trans(
      "walsgit_discussion_cards.forum.brokenImagesModal.title"
    );
  }

  content() {
    const discussions = this.attrs.discussions || [];
    const listed = discussions.slice(0, MAX_LISTED);
    const hidden = discussions.length - listed.length;

    return (
      <div className="Modal-body">
        <p>
          {app.translator.trans(
            "walsgit_discussion_cards.forum.brokenImagesModal.intro"
          )}
        </p>
        <p>
          {app.translator.trans(
            "walsgit_discussion_cards.forum.brokenImagesModal.listTitle",
            { count: discussions.length }
          )}
        </p>
        <ul className="dc-broken-images-list">
          {listed.map((discussion) => (
            <li key={discussion.id()}>
              <Link
                href={app.route.discussion(discussion)}
                onclick={() => app.modal.close()}
              >
                {discussion.title()}
              </Link>{" "}
              (#{discussion.id()})
            </li>
          ))}
        </ul>
        {hidden > 0 && (
          <p>
            {app.translator.trans(
              "walsgit_discussion_cards.forum.brokenImagesModal.more",
              { count: hidden }
            )}
          </p>
        )}
        <p>
          {app.translator.trans(
            "walsgit_discussion_cards.forum.brokenImagesModal.partial"
          )}
        </p>
        <p>
          {app.translator.trans(
            "walsgit_discussion_cards.forum.brokenImagesModal.action"
          )}
        </p>
      </div>
    );
  }
}
