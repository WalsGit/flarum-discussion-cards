export default function checkOverflowingTags() {
    const cardListItemsOnPrimary = document.querySelectorAll(".CardsListItem.Card .cardLink");
    const cardListItems = document.querySelectorAll(".cardGrid .colSpan-2");

    const toggleOverflowClass = function(cardTags, cardListItem) {
        if (!cardTags) return;

        if (cardTags.scrollWidth > cardListItem.clientWidth - 30) { // -30 to account for the 15px + 15px margins on .cardTags
        cardTags.classList.add("overflowing");
        } else {
        cardTags.classList.remove("overflowing");
        }
    }

    cardListItemsOnPrimary.forEach(cardListItem => {
        const cardTags = cardListItem.querySelector(".cardTags");

        toggleOverflowClass(cardTags, cardListItem);
    });

    cardListItems.forEach(cardListItem => {
        const cardTags = cardListItem.querySelector(".flexBox .cardTags");

        toggleOverflowClass(cardTags, cardListItem);
    });
}