import Form from "flarum/common/components/Form";
import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import app from "flarum/admin/app";

export default class RegenerateImagesModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = false;
    this.output = "";
    this.summary = null;
    this.failures = [];
  }

  className() {
    return "RegenerateImagesModal Modal--medium";
  }

  title() {
    return app.translator.trans(
      "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_title"
    );
  }

  content() {
    return (
      <div className="Modal-body">
        <Form>
          <p className="helpText">
            {app.translator.trans(
              "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_helpText"
            )}
            <a
              href="https://github.com/WalsGit/flarum-discussion-cards/wiki/CLI-Commands#discussion-cardsregenerate-images"
              target="_blank"
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_helpTextUrlTitle"
              )}
              .
            </a>
          </p>
          {/* Regenerate for 20 LATEST discussions */}
          <div className="Form-group">
            <label>
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestLabel"
              )}
            </label>
            <div className="helpText">
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestHelp"
              )}
            </div>
            <Button
              className="Button Button--primary"
              loading={this.loading && this.regenerateType === "latest"}
              disabled={this.loading}
              onclick={() => this.regenerateImages("latest")}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestBtnText"
              )}
            </Button>
          </div>
          {/* Regenerate for 20 LATEST+TOP+NEWEST+OLDEST (LTNO) discussions */}
          <div className="Form-group">
            <label>
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOLabel"
              )}
            </label>
            <div className="helpText">
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOHelp"
              )}
            </div>
            <Button
              className="Button Button--primary"
              loading={this.loading && this.regenerateType === "ltno"}
              disabled={this.loading}
              onclick={() => this.regenerateImages("ltno")}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOBtnText"
              )}
            </Button>
          </div>
          {/* Generate card images for 20 discussions without one */}
          <div className="Form-group">
            <label>
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutLabel"
              )}
            </label>
            <div className="helpText">
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutHelp"
              )}
            </div>
            <Button
              className="Button Button--primary"
              loading={this.loading && this.regenerateType === "without"}
              disabled={this.loading}
              onclick={() => this.regenerateImages("without")}
            >
              {app.translator.trans(
                "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutBtnText"
              )}
            </Button>
          </div>
          {/* ==== OUTPUT ==== */}
          {this.output && (
            <div className="Form-group">
              <div className="RegenerateImages-output">
                <pre>{this.output}</pre>
              </div>
            </div>
          )}
          {this.summary && (
            <div className="Form-group">
              <div className="RegenerateImages-summary">
                {app.translator.trans(
                  "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_summary",
                  {
                    total: this.summary.success + this.summary.errors,
                    success: this.summary.success,
                    errors: this.summary.errors,
                  }
                )}
              </div>
            </div>
          )}
          {this.failures.length > 0 && (
            <div className="Form-group">
              <div className="RegenerateImages-error">
                {this.failures.map((failure) => (
                  <div key={failure.id}>
                    {app.translator.trans(
                      "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_failure",
                      { id: failure.id, message: failure.message }
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }

    regenerateImages(type) {
    this.regenerateType = type;
    this.loading = true;
    this.summary = null;
    this.failures = [];
    this.output = app.translator.trans(
      "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_runningCommand"
    );
    m.redraw.sync(); // Force immediate redraw

    const totals = { selected: 0, done: 0, success: 0, errors: 0 };

    // One request processes as many discussions as its time budget allows,
    // then we call again with the ids left over until nothing remains
    const run = (body) =>
      app
        .request({
          method: "POST",
          url:
            app.forum.attribute("apiUrl") +
            "/walsgit/discussion-cards/regenerate-images",
          body,
        })
        .then((result) => {
          if (body.mode) {
            totals.selected = result.selected;
          }

          totals.success += result.success;
          totals.errors += result.errors;
          totals.done += result.success + result.errors;
          this.failures = this.failures.concat(result.failures);

          if (result.remaining.length > 0) {
            this.output = app.translator.trans(
              "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_progress",
              { done: totals.done, total: totals.selected }
            );
            m.redraw();

            return run({ ids: result.remaining });
          }
        });

    run({ mode: type })
      .then(() => {
        this.loading = false;
        this.output = "";
        this.summary = totals;
        m.redraw();

        app.alerts.show(
          { type: "success" },
          app.translator.trans(
            "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_success"
          )
        );
      })
      .catch(() => {
        this.loading = false;
        this.output = app.translator.trans(
          "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_error"
        );
        m.redraw();

        app.alerts.show(
          { type: "error" },
          app.translator.trans(
            "walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_error"
          )
        );
      });
  }
}
