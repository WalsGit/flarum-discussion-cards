import Form from "flarum/common/components/Form";
import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import app from "flarum/admin/app";

const T =
  "walsgit_discussion_cards.admin.settings.statsToolsBanner.repairImagesModal_";
const API = () => app.forum.attribute("apiUrl") + "/walsgit/discussion-cards/";

// Ids sent per request to the regenerate endpoint (its own maximum) and to the reset endpoint
// Display order of the missing default images: general, then tags, then blog
const defaultRank = (file) =>
  file.startsWith("tags/") ? 1 : file.startsWith("blog-") ? 2 : 0;

const REGENERATE_CHUNK = 200;
const RESET_CHUNK = 500;

export default class RepairBrokenImagesModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.scanning = true;
    this.working = false;
    this.scan = null;
    this.progress = "";
    this.summary = null;
    this.failures = [];
    this.resetDone = null;
    this.failed = false;

    this.runScan();
  }

  className() {
    return "dc-modal dc-repair-modal Modal--medium";
  }

  title() {
    return app.translator.trans(T + "title");
  }

  content() {
    const scan = this.scan;
    const repairable = scan ? scan.missing + scan.otherOrigin : 0;

    const bold = (count) => <strong>{count}</strong>;
    const total = scan
      ? scan.missing + scan.otherOrigin + scan.defaultMissing
      : 0;

    return (
      <div className="Modal-body">
        <Form>
          <p className="helpText">{app.translator.trans(T + "helpText")}</p>

          {this.scanning && (
            <p className="helpText">{app.translator.trans(T + "scanning")}</p>
          )}

          {scan && !this.scanning && (
            <div className="Form-group">
              <p>{app.translator.trans(T + "total", { count: bold(total) })}</p>

              {/* Repairable automatically */}
              <p className="dc-repair-section-title">
                {app.translator.trans(T + "repairableTitle", {
                  count: repairable,
                })}
              </p>
              <ul className="dc-repair-report">
                <li>
                  {app.translator.trans(T + "missing", {
                    count: bold(scan.missing),
                  })}
                </li>
                <li>
                  {app.translator.trans(T + "otherOrigin", {
                    count: bold(scan.otherOrigin),
                  })}
                </li>
              </ul>

              {repairable === 0 ? (
                <p className="helpText">
                  {app.translator.trans(T + "nothingToRepair")}
                </p>
              ) : (
                <Button
                  className="Button Button--primary"
                  loading={this.working}
                  disabled={this.working}
                  onclick={() => this.repair()}
                >
                  {app.translator.trans(T + "repairBtnText", {
                    count: scan.ids.length,
                  })}
                </Button>
              )}
              {scan.truncated && (
                <p className="helpText">
                  {app.translator.trans(T + "truncated")}
                </p>
              )}
            </div>
          )}

          {this.progress && (
            <div className="Form-group">
              <div className="dc-regenerate-output">
                <pre>{this.progress}</pre>
              </div>
            </div>
          )}

          {this.summary && (
            <div className="Form-group">
              <div className="dc-regenerate-summary">
                {app.translator.trans(T + "summary", {
                  total: bold(this.summary.success + this.summary.errors),
                  success: bold(this.summary.success),
                  errors: bold(this.summary.errors),
                })}
              </div>
            </div>
          )}

          {this.failures.length > 0 && (
            <div className="Form-group">
              <div className="dc-regenerate-error">
                {this.failures.map((failure) => (
                  <div key={failure.id}>
                    {app.translator.trans(T + "failure", {
                      id: failure.id,
                      message: failure.message,
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last resort once a repair ran and some discussions are still broken */}
          {this.summary && scan && !this.working && repairable > 0 && (
            <div className="Form-group">
              <p className="dc-regenerate-error">
                {app.translator.trans(T + "stillBroken", {
                  count: bold(scan.ids.length),
                })}
              </p>
              <p className="helpText">
                {app.translator.trans(T + "resetHelp")}
              </p>
              <Button
                className="Button Button--danger"
                disabled={this.working}
                onclick={() => this.reset()}
              >
                {app.translator.trans(T + "resetBtnText", {
                  count: scan.ids.length,
                })}
              </Button>
            </div>
          )}

          {this.resetDone !== null && (
            <div className="Form-group">
              <div className="dc-regenerate-summary">
                {app.translator.trans(T + "resetDone", {
                  count: bold(this.resetDone),
                })}
              </div>
            </div>
          )}

          {/* Manual intervention: missing default images (general first, then tags, blog last) */}
          {scan && !this.scanning && scan.defaultMissing > 0 && (
            <div className="Form-group">
              <p className="dc-repair-section-title">
                {app.translator.trans(T + "manualTitle", {
                  count: scan.defaultMissing,
                })}
              </p>
              <p className="helpText">
                {app.translator.trans(T + "manualHelp")}
              </p>
              <ul className="dc-repair-report">
                {scan.defaults
                  .slice()
                  .sort((x, y) => defaultRank(x.file) - defaultRank(y.file))
                  .map((item) => (
                    <li key={item.file}>
                      {app.translator.trans(T + "defaultMissingItem", {
                        file: <em>{item.file}</em>,
                        count: bold(item.discussions),
                      })}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {scan && !this.scanning && (
            <p className="helpText">
              {app.translator.trans(T + "external", {
                count: bold(scan.external),
              })}
            </p>
          )}

          {this.failed && (
            <div className="Form-group">
              <div className="dc-regenerate-error">
                {app.translator.trans(T + "error")}
              </div>
            </div>
          )}

          <div className="Form-group">
            <Button
              className="Button"
              disabled={this.scanning || this.working}
              onclick={() => this.runScan()}
            >
              {app.translator.trans(T + "rescanBtnText")}
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  runScan(keepResult = false) {
    this.scanning = true;
    this.failed = false;

    if (!keepResult) {
      this.progress = "";
      this.summary = null;
      this.failures = [];
      this.resetDone = null;
    }

    m.redraw();

    return app
      .request({ method: "GET", url: API() + "broken-images" })
      .then((result) => {
        this.scan = result;
        this.scanning = false;
        m.redraw();
      })
      .catch(() => {
        this.scanning = false;
        this.failed = true;
        m.redraw();
      });
  }

  repair() {
    const pending = this.scan.ids.slice();
    const total = pending.length;
    const totals = { success: 0, errors: 0 };

    this.working = true;
    this.failed = false;
    this.summary = null;
    this.resetDone = null;
    this.failures = [];
    m.redraw.sync();

    // Same endpoint as the "Regenerate" tool: one request processes as many discussions as its
    // time budget allows, the ids left over go back to the front of the queue
    const next = () => {
      if (pending.length === 0) {
        return Promise.resolve();
      }

      return app
        .request({
          method: "POST",
          url: API() + "regenerate-images",
          body: { ids: pending.splice(0, REGENERATE_CHUNK) },
        })
        .then((result) => {
          totals.success += result.success;
          totals.errors += result.errors;
          this.failures = this.failures.concat(result.failures);
          pending.unshift(...result.remaining);

          this.progress = app.translator.trans(T + "progress", {
            done: totals.success + totals.errors,
            total,
          });
          m.redraw();

          return next();
        });
    };

    return next()
      .then(() => {
        this.progress = "";
        this.summary = totals;

        // Scan again: what is still broken is what the repair could not fix
        return this.runScan(true);
      })
      .catch(() => {
        this.progress = "";
        this.failed = true;
      })
      .then(() => {
        this.working = false;
        m.redraw();
      });
  }

  reset() {
    const pending = this.scan.ids.slice();
    let reset = 0;

    this.working = true;
    this.failed = false;
    m.redraw.sync();

    const next = () => {
      if (pending.length === 0) {
        return Promise.resolve();
      }

      return app
        .request({
          method: "POST",
          url: API() + "broken-images/reset",
          body: { ids: pending.splice(0, RESET_CHUNK) },
        })
        .then((result) => {
          reset += result.reset;

          return next();
        });
    };

    return next()
      .then(() => {
        this.resetDone = reset;
        this.summary = null;
        this.failures = [];

        return this.runScan(true);
      })
      .catch(() => {
        this.failed = true;
      })
      .then(() => {
        this.working = false;
        m.redraw();
      });
  }
}
