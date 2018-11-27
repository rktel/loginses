import { Personal, Equipments } from '../../imports/api/collections'

Meteor.publish('personal', () => {

    return Personal.find({ role: { $ne: Meteor.settings.private.HYPER_PERSONAL_ROLE } })
})

Meteor.publish('equipments', () => {

    return Equipments.find({})
})