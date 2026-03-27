import Modal from "flarum/common/components/Modal";
import Button from "flarum/common/components/Button";
import app from 'flarum/app';

export default class RegenerateImagesModal extends Modal {
    oninit(vnode) {
        super.oninit(vnode);

        this.loading = false;
        this.output = "";
        this.commandOutput = [];
        this.exitCode = 0;
        this.errorOutput = "";
    }

    className() {
        return "RegenerateImagesModal Modal--medium";
    }

    title() {
        return app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_title");
    }

    content() {
        return (
            <div className="Modal-body">
                <div className="Form">
                    <p className="helpText">
                        {app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_helpText")} 
                        <a href="https://github.com/WalsGit/flarum-discussion-cards/wiki/CLI-Commands#discussion-cardsregenerate-images" target="_blank">
                            {app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_helpTextUrlTitle")}.
                        </a>
                    </p>

                    {/* Regenerate for 20 LATEST discussions */}
                    <div className="Form-group">
                        <label>{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestLabel")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestHelp")}</div>
                        <Button
                            className="Button Button--primary"
                            loading={this.loading && this.regenerateType === 'latest'}
                            disabled={this.loading}
                            onclick={() => this.regenerateImages('latest')}
                        >
                            {app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLatestBtnText")}
                        </Button>
                    </div>

                    {/* Regenerate for 20 LATEST+TOP+NEWEST+OLDEST (LTNO) discussions */}
                    <div className="Form-group">
                        <label>{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOLabel")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOHelp")}</div>
                        <Button
                            className="Button Button--primary"
                            loading={this.loading && this.regenerateType === 'ltno'}
                            disabled={this.loading}
                            onclick={() => this.regenerateImages('ltno')}
                        >
                            {app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateLTNOBtnText")}
                        </Button>
                    </div>

                    {/* Generate card images for 20 discussions without one */}
                    <div className="Form-group">
                        <label>{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutLabel")}</label>
						<div className="helpText">{app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutHelp")}</div>
                        <Button
                            className="Button Button--primary"
                            loading={this.loading && this.regenerateType === 'without'}
                            disabled={this.loading}
                            onclick={() => this.regenerateImages('without')}
                        >
                            {app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_regenerateWithoutBtnText")}
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

                    {this.exitCode === 0 && this.commandOutput && this.commandOutput.length > 0 && (
                        <div className="Form-group">
                            <div className="RegenerateImages-summary">
                                {this.commandOutput
                                    .filter(line => line && (line.startsWith("➡ Regeneration summary:") || line[0]))
                                    .map((line, index) => (
                                        <div key={index}>{line}</div>
                                    ))
                                }
                            </div>
                        </div>
                    )}

                    {this.exitCode === 1 && this.errorOutput && (
                        <div className="Form-group">
                            <div className="RegenerateImages-error">
                                <div>Error: {this.errorOutput}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    regenerateImages(type) {
        this.regenerateType = type;
        this.loading = true;
        this.output = app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_runningCommand");
        this.commandOutput = [];
        m.redraw.sync(); // Force immediate redraw

        setTimeout(() => {
            app.request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/walsgit/discussion-cards/regenerate-images' + (
                    type === 'ltno' ? '?ltno=true' 
                    : type === 'without' ? '?without=true'
                    : ''),
            }).then(result => {
                this.loading = false;
                this.output = result.command + "\n";
                this.commandOutput = result.output;
                this.exitCode = result.exitCode;
                this.errorOutput = result.errorOutput;
                m.redraw();

                // Show success message
                app.alerts.show(
                    { type: 'success' },
                    app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_success")
                );
            }).catch(err => {
                this.loading = false;
                this.output = app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_error");
                this.commandOutput = [];
                this.exitCode = 1;
                this.errorOutput = err.message || app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_unknownError");
                m.redraw();

                // Show error message
                app.alerts.show(
                    { type: 'error' },
                    app.translator.trans("walsgit_discussion_cards.admin.settings.statsToolsBanner.regenerateImagesModal_error")
                );
            });
        }, 500); // 500ms delay to see the running message
    }
}