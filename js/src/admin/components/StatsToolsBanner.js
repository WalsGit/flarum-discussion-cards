import Component from 'flarum/common/Component';
import Dropdown from 'flarum/common/components/Dropdown';
import Button from 'flarum/common/components/Button';
import app from 'flarum/admin/app';
import PurgeImagesModal from './PurgeImagesModal';
import RegenerateImagesModal from './RegenerateImagesModal';
import DebugModal from './DebugModal';

export default class StatsToolsBanner extends Component {
  oninit() {
    this.loading = true;
    this.stats = {};

    this.loadStats();
  }

  loadStats() {
    this.loading = true;

    app
      .request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/image-stats',
      })
      .then((result) => {
        this.stats = result;
        this.loading = false;
        m.redraw();
      });
  }

  refreshStats() {
    this.loading = true;

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/image-stats/refresh',
      })
      .then((result) => {
        this.stats = result;
        this.loading = false;
        m.redraw();
        app.alerts.show({ type: 'success' }, app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.refreshStats'));
      });
  }

  view() {
    return (
      <div className="DashboardWidget Widget StatusWidget DiscussionCardsSettings--content">
        <ul>
          <li className="StatsWidget-item">
            <span className="StatsWidget-label">{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.statTotalImagesTitle')}</span>
            <br />
            <strong className="StatsWidget-value">{this.loading ? '…' : this.stats.totalImages}</strong>
          </li>

          <li className="StatsWidget-item">
            <span className="StatsWidget-label">{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.statDiscussionImagesTitle')}</span>
            <br />
            <strong className="StatsWidget-value">{this.loading ? '…' : this.stats.discussionImages}</strong>
          </li>

          <li className="StatsWidget-item">
            <span className="StatsWidget-label">{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.statDiscussionsWithoutImagesTitle')}</span>
            <br />
            <strong className="StatsWidget-value">{this.loading ? '…' : this.stats.discussionsWithoutImages}</strong>
          </li>

          <li className="StatsWidget-item">
            <span className="StatsWidget-label">{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.statUnusedImagesTitle')}</span>
            <br />
            <strong className="StatsWidget-value">{this.loading ? '…' : this.stats.unusedImages}</strong>
          </li>

          {/* ==== Tools menu ==== */}
          <li className="item-tools">
            <Dropdown 
              label={app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.toolsMenuLabel')} 
              icon="fas fa-cog" 
              buttonClassName="Button" 
              menuClassName="Dropdown-menu--right"
            >
              <Button onclick={() => this.refreshStats()}>
                {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.toolsMenuUpdateStats')}
              </Button>

              <Button onclick={() => app.modal.show(PurgeImagesModal)}>
                {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.toolsMenuPurgeImages')}
              </Button>

              <Button onclick={() => app.modal.show(RegenerateImagesModal)}>
                {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.toolsMenuRegenerateImages')}
              </Button>

              <Button onclick={() => app.modal.show(DebugModal)}>
                {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.toolsMenuDebug')}
              </Button>
            </Dropdown>
          </li>
        </ul>
      </div>
    );
  }
}
