export default function compareTags(currentTag, priorityTag) {
    if (currentTag.isChild && !priorityTag.isChild) return -1;
    if (!currentTag.isChild && priorityTag.isChild) return 1;
    if (currentTag.isChild && priorityTag.isChild && currentTag.parent === priorityTag.parent) return currentTag.position - priorityTag.position;
    if (currentTag.isChild && priorityTag.isChild && currentTag.parent !== priorityTag.parent) return currentTag.parent - priorityTag.parent;

    if (!currentTag.position && priorityTag.position) return 1;
    if (currentTag.position && !priorityTag.position) return -1;
    if (currentTag.position && priorityTag.position) return currentTag.position - priorityTag.position;
    return currentTag.id - priorityTag.id;
}