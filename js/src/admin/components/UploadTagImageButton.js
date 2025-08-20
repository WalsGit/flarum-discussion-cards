import app from "flarum/admin/app";
import Button from "flarum/common/components/Button";
import classList from "flarum/common/utils/classList";
import EditTagModal from "flarum/tags/components/EditTagModal";


export default class UploadTagImageButton extends Button {
	constructor(props) {
		super(props);
		this.tagId = props.attrs.tagId;
	}
	
	loading = false;

	view(vnode) {
		this.attrs.loading = this.loading;
		this.attrs.className = classList(this.attrs.className, "Button");

		if (app.store.data.tags[this.tagId].data.attributes.walsgitDiscussionCardsTagDefaultImage) {
			this.attrs.onclick = this.remove.bind(this);

			return (
				<div>
					<p>
						<img
							className="DC-TagDefaultImage"
							src={"assets/" + app.store.data.tags[this.tagId].data.attributes.walsgitDiscussionCardsTagDefaultImage}
							alt=""
							width="200px"
						/>
					</p>
					<p>
						{super.view({
							...vnode,
							children: app.translator.trans(
								"core.admin.upload_image.remove_button"
							),
						})}
					</p>
				</div>
			);
		} else {
			this.attrs.onclick = this.upload.bind(this);
		}

		return super.view({
			...vnode,
			children: app.translator.trans(
				"core.admin.upload_image.upload_button"
			),
		});
	}

	/**
	 * Prompt the user to upload an image.
	 */
	upload() {
		if (this.loading) return;

		const $input = $('<input type="file">');

		$input
			.appendTo("body")
			.hide()
			.trigger("click")
			.on("change", (e) => {
				const body = new FormData();
				body.append(this.attrs.name, $(e.target)[0].files[0]);
				body.append('tagId', this.tagId);

				this.loading = true;
				m.redraw();

				app.request({
					method: "POST",
					url: this.resourceUrl(),
					serialize: (raw) => raw,
					body,
				}).then(this.success.bind(this), this.failure.bind(this));
			});
	}

	/**
	 * Remove the image.
	 */
	remove() {
		this.loading = true;
		m.redraw();
		
		const body = new FormData();
		body.append('tagId', this.tagId);

		app.request({
			method: "DELETE",
			url: this.resourceUrl(),
			body,
		}).then(this.success.bind(this), this.failure.bind(this));
	}

	resourceUrl() {
		return app.forum.attribute("apiUrl") + "/" + this.attrs.name;
	}

	/**
	 * After a successful upload/removal, reload the page.
	 *
	 * @param {object} response
	 * @protected
	 */
	success(response) {
		window.location.reload();
	}

	/**
	 * If upload/removal fails, stop loading.
	 *
	 * @param {object} response
	 * @protected
	 */
	failure(response) {
		this.loading = false;
		m.redraw();
	}
}
