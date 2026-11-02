import Form from "flarum/common/components/Form";
import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import app from "flarum/admin/app";
import newActionId from "../helpers/newActionId";

export default class PurgeImagesModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = false;
    this.output = "";
    this.summary = null;
  }

  className() {
    return "dc-modal dc-purge-modal Modal--medium";
  }

  title() {
    return app.translator.trans(
      "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_title"
    );
  }

  content() {
    return (
      <div className="Modal-body">
        <Form>
          <p className="helpText">
            {app.translator.trans(
              "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_helpText"
            )}
          </p>
          <div className="Form-group">
            <label>
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedLabel"
              )}
            </label>
            <div className="helpText">
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedHelp"
              )}
            </div>
            <Button
              className="Button Button--primary"
              icon="fas fa-trash"
              loading={this.loading && this.purgeType === "unused"}
              disabled={this.loading}
              onclick={() => this.purgeImages("unused")}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedBtnText"
              )}
            </Button>
          </div>
          <div className="Form-group">
            <label>
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllLabel"
              )}
            </label>
            <div className="helpText">
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllHelp"
              )}
            </div>
            <Button
              className="Button Button--danger"
              icon="fas fa-trash"
              loading={this.loading && this.purgeType === "all"}
              disabled={this.loading}
              onclick={() => this.purgeImages("all")}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllBtnText"
              )}
            </Button>
          </div>
          {this.output && (
            <div className="Form-group">
              <div className="dc-purge-output">
                <pre>{this.output}</pre>
              </div>
            </div>
          )}
          {this.summary && (
            <div className="Form-group">
              <div className="dc-purge-summary">
                {app.translator.trans(
                  "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_summary",
                  {
                    deleted: this.summary.deleted,
                    skipped: this.summary.skipped,
                    updated: this.summary.updated,
                  }
                )}
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }

  purgeImages(type) {
    this.purgeType = type;
    this.loading = true;
    this.output = app.translator.trans(
      "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_runningCommand"
    );
    this.summary = null;
    m.redraw.sync(); // Force immediate redraw

    setTimeout(() => {
      app
        .request({
          method: "POST",
          url:
            app.forum.attribute("apiUrl") +
            "/walsgit/discussion-cards/purge-images" +
            (type === "all" ? "?all=true&" : "?") +
            "action=" +
            (type === "all" ? "purge-all" : "purge-unused") +
            "&actionId=" +
            newActionId(),
        })
        .then((result) => {
          this.loading = false;

          // The server refused to run the purge (already running, missing folder...)
          if (result.error) {
            this.output = result.error;
            m.redraw();
            app.alerts.show({ type: "error" }, result.error);
            return;
          }

          this.output = "";
          this.summary = result;
          m.redraw();

          app.alerts.show(
            { type: "success" },
            app.translator.trans(
              "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_success"
            )
          );
        })
        .catch((err) => {
          this.loading = false;
          this.output = app.translator.trans(
            "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_error"
          );
          m.redraw();

          app.alerts.show(
            { type: "error" },
            app.translator.trans(
              "walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_error"
            )
          );
        });
    }, 500); // 500ms delay to see the running message
  }
}
