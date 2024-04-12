import { ability } from '@sass/auth'

const userCanInvaitSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOtherUser = ability.can('delete', 'User')

const userCannotDeleteOthersUsers = ability.cannot('delete', 'User')

console.log(userCanInvaitSomeoneElse, userCanDeleteOtherUser)
console.log(userCannotDeleteOthersUsers)
