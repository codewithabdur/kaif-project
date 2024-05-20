import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'background',
    title: 'Background',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'backgroundimg',
            title: 'BackgroundImg',
            type: 'image',
        }),
    ],
})