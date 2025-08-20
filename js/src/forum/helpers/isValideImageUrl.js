export default function isValideImageUrl (url) {
    if(typeof url !== 'string') return false;
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch {
        return false;
    }

    const extension = parsedUrl.pathname.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
}