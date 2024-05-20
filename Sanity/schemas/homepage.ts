import {defineType, defineField} from 'sanity'

export default defineType({
    name: 'homepage',
    title: 'Homepage',
    type: 'document',
    fields: [
        defineField({
            name: 'salutation',
            title: 'Salutation',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'desc',
            title: 'Desc',
            type: 'text',
        }),
    ],
})