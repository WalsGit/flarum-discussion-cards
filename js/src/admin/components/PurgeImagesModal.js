import Form from 'flarum/common/components/Form';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import app from 'flarum/admin/app';

export default class PurgeImagesModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.loading = false;
    this.output = '';
    this.commandOutput = [];
  }

  className() {
    return 'PurgeImagesModal Modal--medium';
  }

  title() {
    return app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_title');
  }

  content() {
    return (
      <div className="Modal-body">
        <Form>
          <p className="helpText">{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_helpText')}</p>
          <div className="Form-group">
            <label>{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedLabel')}</label>
            <div className="helpText">
              {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedHelp')}
            </div>
            <Button
              className="Button Button--primary"
              icon="fas fa-trash"
              loading={this.loading && this.purgeType === 'unused'}
              disabled={this.loading}
              onclick={() => this.purgeImages('unused')}
            >
              {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteUnusedBtnText')}
            </Button>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllLabel')}</label>
            <div className="helpText">
              {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllHelp')}
            </div>
            <Button
              className="Button Button--danger"
              icon="fas fa-trash"
              loading={this.loading && this.purgeType === 'all'}
              disabled={this.loading}
              onclick={() => this.purgeImages('all')}
            >
              {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_deleteAllBtnText')}
            </Button>
          </div>
          {this.output && (
            <div className="Form-group">
              <div className="PurgeImages-output">
                <pre>{this.output}</pre>
              </div>
            </div>
          )}
          {this.commandOutput.length > 0 && (
            <div className="Form-group">
              <div className="PurgeImages-summary">
                {this.commandOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
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
    this.output = app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_runningCommand');
    this.commandOutput = [];
    m.redraw.sync(); // Force immediate redraw

    setTimeout(() => {
      app
        .request({
          method: 'POST',
          url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/purge-images' + (type === 'all' ? '?all=true' : ''),
        })
        .then((result) => {
          this.loading = false;
          this.output = result.command + '\n';
          this.commandOutput = result.output;
          m.redraw();

          // Show success message
          app.alerts.show(
            { type: 'success' },
            app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_success')
          );
        })
        .catch((err) => {
          this.loading = false;
          this.output = app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_error');
          this.commandOutput = [
            err.message || app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_unknownError'),
          ];
          m.redraw();

          // Show error message
          app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.purgeImagesModal_error'));
        });
    }, 500); // 500ms delay to see the running message
  }
}
