import { Personal, Equipments } from '../../imports/api/collections'
import { p } from '../../imports/api/tools'
// PERSONAL
Meteor.methods({
    getPersonal: function () {
        return Personal.findOne({ userId: this.userId })
    },
    createPersonal: function (personal) {
        const { firstname, lastname, role } = personal
        return Personal.insert({ firstname, lastname, role })
    },
    removePersonal: function (personal) {
        const { _id, userId } = personal
        if (userId) {
            Meteor.users.remove({ _id: userId })
        }
        return Personal.remove({ _id })
    },
    updatePersonal: function (personal) {
        const { firstname, lastname, role, _id } = personal
        return Personal.update({ _id }, { $set: { firstname, lastname, role } })
    }
})
//PERSONAL-USER
Meteor.methods({
    createPersonalUser: function (personal) {
        const { username, password } = createCredentials(personal)
        const userId = Accounts.createUser({ username, password })
        return Personal.upsert({ _id: personal._id }, { $set: { userId, username, password } })
    }
})
// EQUIPMENTS
Meteor.methods({
    createEquipment: function (equipment) {
        const { type, serial, brand, model, registeredBy } = equipment
        return Equipments.insert({ type, serial, brand, model, registeredBy, registeredDate: new Date(), status: 'Stock' })
    },
    updateEquipment: function (equipment) {
        const { type, serial, brand, model, _id, updatedBy, status } = equipment
        return Equipments.upsert({ _id }, { $set: { type, serial, brand, model, updatedBy, updatedDate: new Date(), status } })
    },
    removeEquipment: function (equipment) {
        const { _id } = equipment
        return Equipments.remove({ _id })
    }
})

//FUNCTIONS HELPERS
function createCredentials(personal) {
    const { firstname, lastname } = personal
    const firstLetterUsername = firstname.substr(0, 1).toLowerCase()
    const moreLetterUsername = lastname.split(' ') ? lastname.split(' ')[0].toLowerCase().replace(/[aeiouáéíóú]/ig, '') : lastname.toLowerCase().replace(/[aeiouáéíóú]/ig, '')
    const username = firstLetterUsername + moreLetterUsername
    const password = firstname.split(' ') ? firstname.split(' ')[0].toLowerCase().replace(/[aeiouáéíóú]/ig, '') + Date.now().toString().substr(11) : firstname.toLowerCase().replace(/[aeiouáéíóú]/ig, '') + Date.now().toString().substr(11)
    return {
        username,
        password
    }
}