import { Extension } from '@tiptap/core'
import '@tiptap/extension-text-style'

export const CustomHighlight = Extension.create({
  name: 'customHighlight',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          highlight: {
            default: null,
            parseHTML: element => element.style.backgroundColor,
            renderHTML: attributes => {
              if (!attributes.highlight) {
                return {}
              }

              return {
                style: `background-color: ${attributes.highlight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setHighlight: highlight => ({ chain }) => {
        return chain()
          .setMark('textStyle', { highlight })
          .run()
      },
      unsetHighlight: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { highlight: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

export default CustomHighlight 