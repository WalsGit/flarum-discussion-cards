/*
* Checks overflowing content on cards like long list of Tags or long titles and makes them scroll on hover
*/
export default function checkOverflowingContent() {
    const cardListItemsOnPrimary = document.querySelectorAll(".CardsListItem.Card .cardLink");
    const cardListItems = document.querySelectorAll(".cardGrid .colSpan-2");

    const toggleOverflowClass = function (cardTags, cardListItem) {
        if (!cardTags) return;

        // -30 to account for the 15px + 15px margins on .cardTags
        if (cardTags.scrollWidth > cardListItem.clientWidth - 30) {
            cardTags.classList.add("overflowing");
        } else {
            cardTags.classList.remove("overflowing");
        }
    };

    // Tags on Primary cards
    cardListItemsOnPrimary.forEach((cardListItem) => {
        const cardTags = cardListItem.querySelector(".cardTags");
        toggleOverflowClass(cardTags, cardListItem);
    });

    // Tags & Titles list cards
    cardListItems.forEach((cardListItem) => {
        const cardTags = cardListItem.querySelector(".flexBox .cardTags");
        toggleOverflowClass(cardTags, cardListItem);

        const cardTitle = cardListItem.querySelector(".cardTitle h2.title");
        if (!cardTitle) return;

        // only on tablet & desktop screens for title
        if (app.screen() !== "phone" && cardTitle.scrollWidth > cardTitle.clientWidth) {
            cardTitle.classList.add("overflowing");
        } else {
            cardTitle.classList.remove("overflowing");
        }
    });
}
