// auth.js in service folder
const sessionIdToUserMap = new Map();

function setUser(id, user) {
    sessionIdToUserMap.set(id, user);
}

function getUser(id) {
    return sessionIdToUserMap.get(id); // Return user based on the ID
}

module.exports = { setUser, getUser };
