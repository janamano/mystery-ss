require('dotenv').config()
var Wishes = require("../db/Wish");

function makeWish({ wishName, wishLink, req}) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }

    const newWish = new Wishes({
        username: currentUser.username,
        wishName,
        wishLink
    })

    return newWish.save()
}

function deleteWish({ wishId, req}) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    // TODO: ensure than other users cannot delete this users wishes
    return Wishes.findByIdAndDelete(wishId).
    then(wish => {
        return new Promise((resolve, reject) => {
            resolve(wish)
        });
    })
}

function changeWish({ wishId, wishName, wishLink, req}) {
    var currentUser = req.req.session.user;
    // we have to be logged in to create a group
    if (currentUser == null) {
        throw new Error('not authorized to do this action')
    }
    // TODO: ensure than other users cannot change this users wishes
    return Wishes.findByIdAndUpdate(wishId, {
        wishName,
        wishLink
    }, { new: true}).
    then(wish => {
        return new Promise((resolve, reject) => {
            resolve(wish)
        });
    })
}


module.exports = { makeWish, deleteWish, changeWish }
