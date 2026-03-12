import Component from 'flarum/common/Component';
import Dropdown from 'flarum/common/components/Dropdown';
import Button from 'flarum/common/components/Button';
import app from 'flarum/app';
import PurgeImagesModal from './PurgeImagesModal';

export default class StatsToolsBanner extends Component {
	oninit() {
		this.loading = true;
		this.stats = {};

		this.loadStats();
	}

	loadStats() {
		this.loading = true;

		app.request({
			method: 'GET',
			url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/image-stats'
		}).then((result) => {
			this.stats = result;
			this.loading = false;
			m.redraw();
		});
	}

	refreshStats() {
		this.loading = true;

		app.request({
			method: 'POST',
			url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/image-stats/refresh'
		}).then((result) => {
			this.stats = result;
			this.loading = false;
			m.redraw();
			app.alerts.show(
                { type: 'success' },
                app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.refreshStats')
            );
		});
	}

	view() {
		return (
			<div className="DashboardWidget Widget StatusWidget DiscussionCardsSettings--content">
			<ul>
				<li className="StatsWidget-item">
				<span className="StatsWidget-label">Total images</span><br />
				<strong className="StatsWidget-value">
					{this.loading ? '…' : this.stats.totalImages}
				</strong>
				</li>

				<li className="StatsWidget-item">
				<span className="StatsWidget-label">Discussions images</span><br />
				<strong className="StatsWidget-value">
					{this.loading ? '…' : this.stats.discussionImages}
				</strong>
				</li>

				<li className="StatsWidget-item">
				<span className="StatsWidget-label">Discussions without images</span><br />
				<strong className="StatsWidget-value">
					{this.loading ? '…' : this.stats.discussionsWithoutImages}
				</strong>
				</li>

				<li className="StatsWidget-item">
				<span className="StatsWidget-label">Unused images</span><br />
				<strong className="StatsWidget-value">
					{this.loading ? '…' : this.stats.unusedImages}
				</strong>
				</li>

				{/* ==== Tools menu ==== */}
				<li className="item-tools">
				<Dropdown
					label="Tools"
					icon="fas fa-cog"
					buttonClassName="Button"
					menuClassName="Dropdown-menu--right"
				>
					<Button onclick={() => this.refreshStats()}>
					Update stats
					</Button>
					
					<Button onclick={() => app.modal.show(PurgeImagesModal)}>
					Purge images
					</Button>
				</Dropdown>
				</li>
			</ul>
			</div>
		);
	}
}
