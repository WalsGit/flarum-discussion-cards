/*
 * Checks overflowing content on cards like long list of Tags or long titles and makes them scroll on hover
 */
export default function checkOverflowingContent() {
  const cardListItemsOnPrimary = document.querySelectorAll(
    ".dc-item.dc-item--card .dc-card-link"
  );
  const cardListItems = document.querySelectorAll(
    ".dc-card-grid .dc-col-span-2"
  );

  const toggleOverflowClass = function (cardTags, cardListItem) {
    if (!cardTags) return;

    // -30 to account for the 15px + 15px margins on .dc-card-tags
    if (cardTags.scrollWidth > cardListItem.clientWidth - 30) {
      cardTags.classList.add("dc-overflowing");
    } else {
      cardTags.classList.remove("dc-overflowing");
    }
  };

  // Tags on Primary cards
  cardListItemsOnPrimary.forEach((cardListItem) => {
    const cardTags = cardListItem.querySelector(".dc-card-tags");
    toggleOverflowClass(cardTags, cardListItem);
  });

  // Tags & Titles list cards
  cardListItems.forEach((cardListItem) => {
    const cardTags = cardListItem.querySelector(".dc-flex-box .dc-card-tags");
    toggleOverflowClass(cardTags, cardListItem);

    const cardTitle = cardListItem.querySelector(
      ".dc-card-title h2.dc-card-heading"
    );
    if (!cardTitle) return;

    // only on tablet & desktop screens for title
    if (
      app.screen() !== "phone" &&
      cardTitle.scrollWidth > cardTitle.clientWidth
    ) {
      cardTitle.classList.add("dc-overflowing");
    } else {
      cardTitle.classList.remove("dc-overflowing");
    }
  });
}
