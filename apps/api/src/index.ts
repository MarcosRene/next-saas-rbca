import { defineAbilityFor } from '@sass/auth'
import { projectSchema } from '@sass/auth/src/models/project'

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-id' })

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user-id' })

console.log(ability.can('get', 'Billing'))
console.log(ability.can('create', 'Invate'))
console.log(ability.can('delete', project))
