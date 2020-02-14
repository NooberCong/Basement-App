//Input format
const isEmpty = (s) => s.trim().length === 0;
const formatUrl = (url) => url.trim().startsWith('http')? url.trim(): `http://${url.trim()}`;

//
exports.handleDetailsUpdate = (data) => {
    let updates = {};
    if (!isEmpty(data.bio)) updates.bio = data.bio.trim();
    if (!isEmpty(data.website)) updates.website = formatUrl(data.website);
    if (!isEmpty(data.location)) updates.location = data.location.trim();
    return updates;
}
