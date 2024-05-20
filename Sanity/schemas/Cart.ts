import {defineType, defineField} from 'sanity'

export default defineType({
    name: 'cart',
    title: 'Cart',
    type: 'document',
    fields: [
        defineField({
            name: 'charge',
            title: 'Charge',
            type: 'string',
        }),
    ],
})