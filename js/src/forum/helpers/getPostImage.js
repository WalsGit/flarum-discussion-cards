import isValideImageUrl from "./isValideImageUrl";

export default function getPostImage(post, image, isblogPost = false, key = 1) {

  const regex = /<img(?!.*?class="emoji").*?src=[\'"](.*?)[\'"].*?>|background(?:-image)?:\s*url\(['"]?(.*?)['"]?\)/i;

  if(isblogPost && isValideImageUrl(image)) {
    return image;
  }

  const assetImage = app.forum.attribute("baseUrl") + "/assets/" + image;

  if (post) {
    const src = regex.exec(post.contentHtml());
    if (typeof key === "number" && key > 0) {
      return (src) ? (src[1] || src[2]) : (image ? assetImage : null);
    } else if (key === '~') {
      return src;
    } else {
      return null;
    }
  }

}
