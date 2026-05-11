import app from "flarum/app";
import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import { getDiscussionSettings } from "../../forum/helpers/getDiscussionSettings";
import isExtensionInstalled from "../helpers/isExtensionInstalled";
import isExtensionActive from "../helpers/isExtensionActive";

export default class DebugModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.loading = false;
        this.loadInfo();
        this.discussionId = null;
        this.output = "";
        this.version = app.data.extensions['walsgit-discussion-cards'].version;
        this.settings = getDiscussionSettings();
    }

    className() {
        return "InfoModal Modal--large";
    }

    title() {
        return app.translator.trans(
        "walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_title",
        );
    }

    content() {
        return (
            <div className="Modal-body">
                <div>
                    <pre className="InfoModal-content InfoSettings">
                            Discussion Cards version: {this.version + '\n'}

                            ===== SETTINGS ===== {'\n'}
                            {Object.keys(this.settings).map(key => {
                                const value = this.settings[key];
                                let settingLine = `${key}: ${value}`;

                                if (key === 'showViews') {
                                    const viewsExtensionInstalled = isExtensionInstalled("fof-discussion-views") ? 'is' : "is not";
                                    const viewsExtensionActivated = isExtensionActive("fof-discussion-views") ? "is" : "not";
                                    const mbViewsExtensionInstalled = isExtensionInstalled("michaelbelgium-discussion-views") ? 'is' : "is not";
                                    const mbViewsExtensionActivated = isExtensionActive("michaelbelgium-discussion-views") ? "is" : "not";
                                    settingLine = settingLine + `\n └ [fof/discussion-views ${viewsExtensionInstalled} installed & ${viewsExtensionActivated} activated] \n └ [michaelbelgium/flarum-discussion-views ${mbViewsExtensionInstalled} installed & ${mbViewsExtensionActivated} activated]`
                                }

                                if (key === 'useBlogImages') {
                                    const blogExtensionInstalled = isExtensionInstalled("v17development-blog") ? 'is' : "is not";
                                    const blogExtensionActivated = isExtensionActive("v17development-blog") ? "is" : "not";
                                    settingLine = settingLine + `\n └ [v17development/blog ${blogExtensionInstalled} installed & ${blogExtensionActivated} activated]`
                                }

                                if (key === 'allowRepostLinks') {
                                    const repostExtensionInstalled = isExtensionInstalled("shebaoting-repost") ? 'is' : "is not";
                                    const repostExtensionActivated = isExtensionActive("shebaoting-repost") ? "is" : "not";
                                    settingLine = settingLine + `\n └ [shebaoting/repost ${repostExtensionInstalled} installed & ${repostExtensionActivated} activated]`
                                }
                                
                                return settingLine + '\n';
                            })}

                            ===== OTHER SYSTEM INFO ===== {'\n'}
                            {this.info}

                    </pre>

                    <div className="InfoModal-actions">
                        <Button className="Button Button--primary" onclick={() => this.copyToClipboard('.InfoSettings')}>
                            {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_copyButton')}
                        </Button>
                    </div>

                    <div className="Form">
                        <h3>{app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_discussionDebugTitle')}</h3>
                        <div className="helpText">
                            {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_discussionDebugHelpText')}
                        </div>

                        <div className="Debug-discussion">
                            <div className="Form-group">
                                <label htmlFor="discussionId">
                                    {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_discussionDebugLabel')}
                                </label>
                                <input
                                    type="number"
                                    id="discussionId"
                                    name="discussionId"
                                    className="FormControl DC-Number"
                                    value={this.discussionId}
                                    oninput={e => this.discussionId = e.target.value}
                                /> 
                                <Button
                                    type="submit"
                                    className="Button Button--primary"
                                    loading={this.loading}
                                    disabled={this.loading}
                                    onclick={() => this.checkDiscussion()}
                                >
                                    {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_discussionDebugCheckBtn')}
                                </Button>
                            </div>
                        </div>

                        <div className="Debug-discussion-results">
                            <pre className="InfoModal-content InfoDiscussion">
                                {this.output ? this.output : "Test results will be displayed here."}
                            </pre>
                        </div>
                        <div className="InfoModal-actions">
                        <Button className="Button Button--primary" onclick={() => this.copyToClipboard('.InfoDiscussion')}>
                            {app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_copyButton')}
                        </Button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    copyToClipboard(target) {
        const codeElement = document.querySelector(target);
        const textToCopy = codeElement ? codeElement.textContent : '';

        navigator.clipboard.writeText(textToCopy).then(
            () => {
                app.alerts.show({ type: 'success' }, app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_copySuccess'));
            },
            () => {
                app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_copyError'));
            }
        );
    }

    async loadInfo() {
        try {
            const response = await app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/info',
            });

            this.info = response || 'No info available';
        } catch (error) {
            this.info = 'Error loading info: ' + error.message;
        }

        this.loading = false;
        m.redraw();
    }

    checkDiscussion() {
        const discussionId = parseInt(this.discussionId);

		if (isNaN(discussionId) || discussionId < 1) {
			app.alerts.show({ type: 'error' }, app.translator.trans('walsgit_discussion_cards.admin.errors.debugModalDiscussionId'));
			return;
		}

		this.loading = true;
        this.output = app.translator.trans('walsgit_discussion_cards.admin.settings.statsToolsBanner.debugModal_discussionDebugCheckingMessage', {discussionId: discussionId});
        m.redraw.sync();

		setTimeout(() => {
            app.request({
                method: "GET",
                url: app.forum.attribute("apiUrl") + "/walsgit/discussion-cards/check-discussion/:id",
                params: {id: discussionId}
            }).then((result) => {
                this.output = result;
                this.loading = false;
                m.redraw.sync();
            });
        }, 300); // 300ms delay to see the "checking..." message
	}

    
}
