import app from "flarum/admin/app";
import extendEditTagModal from "./extenders/extendEditTagModal";

export { default as extend } from "./extend";

app.initializers.add("walsgit/discussion-cards", () => {
  extendEditTagModal();
});
