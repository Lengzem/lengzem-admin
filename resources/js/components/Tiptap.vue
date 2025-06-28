<script setup>
// ... all your existing script setup code ...
// NO CHANGES ARE NEEDED IN THE SCRIPT SECTION
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { Image } from '@tiptap/extension-image'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { watch } from 'vue'

// Import all the necessary icons
import FormatBold from 'vue-material-design-icons/FormatBold.vue'
import FormatItalic from 'vue-material-design-icons/FormatItalic.vue'
import FormatUnderline from 'vue-material-design-icons/FormatUnderline.vue'
import FormatStrikethrough from 'vue-material-design-icons/FormatStrikethrough.vue'
import FormatHeader1 from 'vue-material-design-icons/FormatHeader1.vue'
import FormatHeader2 from 'vue-material-design-icons/FormatHeader2.vue'
import FormatHeader3 from 'vue-material-design-icons/FormatHeader3.vue'
import FormatParagraph from 'vue-material-design-icons/FormatParagraph.vue'
import FormatListBulleted from 'vue-material-design-icons/FormatListBulleted.vue'
import FormatListNumbered from 'vue-material-design-icons/FormatListNumbered.vue'
import FormatQuoteClose from 'vue-material-design-icons/FormatQuoteClose.vue'
import CodeTags from 'vue-material-design-icons/CodeTags.vue'
import Minus from 'vue-material-design-icons/Minus.vue'
import LinkVariant from 'vue-material-design-icons/LinkVariant.vue'
import ImagePlus from 'vue-material-design-icons/ImagePlus.vue'
import FormatAlignLeft from 'vue-material-design-icons/FormatAlignLeft.vue'
import FormatAlignCenter from 'vue-material-design-icons/FormatAlignCenter.vue'
import FormatAlignRight from 'vue-material-design-icons/FormatAlignRight.vue'
import FormatAlignJustify from 'vue-material-design-icons/FormatAlignJustify.vue'
import Undo from 'vue-material-design-icons/Undo.vue'
import Redo from 'vue-material-design-icons/Redo.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

// ✅ Extend Image to support inline style
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'width: 100%; max-width: 100%; height: auto; object-fit: contain;',
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          return {
            style: attributes.style,
          }
        },
      },
    }
  },
})

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    StarterKit.configure({
      // The Link extension is part of StarterKit, configure it here
      link: {
        openOnClick: false, // Prevent navigation when clicking links in editor
      },
    }),
    // ✅ Add missing extensions
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'], // Allow alignment for headings and paragraphs
    }),
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    CustomImage, // 👈 Use extended image with inline style support
  ],
  editorProps: {
    attributes: {
      class: 'tiptap border-t-0 p-4 min-h-[40rem] max-h-[50rem] overflow-y-auto outline-none prose dark:prose-invert max-w-none focus:outline-none',
    },
  },
})

// Watch for external modelValue changes and update editor content
watch(() => props.modelValue, (newValue) => {
  // Check if the editor content is already the same as the new value
  const isSame = editor.value.getHTML() === newValue

  // If the content is the same, do nothing to avoid an infinite loop
  if (isSame) {
    return
  }

  // Otherwise, update the editor's content
  editor.value?.commands.setContent(newValue, false)
})

// 🔗 Set link
const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// 🖼️ Add image with inline style
const addImage = () => {
  const url = window.prompt('Image URL')
  if (url) {
    editor.value
      .chain()
      .focus()
      .setImage({
        src: url,
        style: 'width: 100%; max-width: 100%; height: auto; object-fit: contain;',
      })
      .run()
  }
}

// 🎨 Text color
const setTextColor = (event) => {
  editor.value.chain().focus().setColor(event.target.value).run()
}
</script>


<template>
  <!-- ... all your existing template code ... -->
  <!-- NO CHANGES ARE NEEDED IN THE TEMPLATE SECTION -->
  <div class="tiptap-container">
    <section v-if="editor" class="toolbar">
      <!-- Group 1: Basic Formatting -->
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" title="Bold">
        <FormatBold />
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" title="Italic">
        <FormatItalic />
      </button>
      <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" title="Underline">
        <FormatUnderline />
      </button>
      <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" title="Strikethrough">
        <FormatStrikethrough />
      </button>
      <div class="divider"></div>

      <!-- Text Color -->
      <input type="color" @input="setTextColor" :value="editor.getAttributes('textStyle').color || '#000000'" title="Text Color"/>

      <!-- Group 2: Headings & Paragraph -->
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" title="Heading 1">
        <FormatHeader1 />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" title="Heading 2">
        <FormatHeader2 />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" title="Heading 3">
        <FormatHeader3 />
      </button>
      <button type="button" @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }" title="Paragraph">
        <FormatParagraph />
      </button>
      <div class="divider"></div>

      <!-- Group 3: Alignment -->
      <button type="button" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }" title="Align Left">
        <FormatAlignLeft />
      </button>
      <button type="button" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }" title="Align Center">
        <FormatAlignCenter />
      </button>
      <button type="button" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }" title="Align Right">
        <FormatAlignRight />
      </button>
      <button type="button" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }" title="Align Justify">
        <FormatAlignJustify />
      </button>

      <div class="divider"></div>

      <!-- Group 4: Lists -->
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" title="Bulleted List">
        <FormatListBulleted />
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" title="Numbered List">
        <FormatListNumbered />
      </button>
      <div class="divider"></div>

      <!-- Group 5: Blocks & Media -->
      <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }" title="Code Block">
        <CodeTags />
      </button>
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }" title="Blockquote">
        <FormatQuoteClose />
      </button>
      <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal Rule">
        <Minus />
      </button>
      <button type="button" @click="setLink" :class="{ 'is-active': editor.isActive('link') }" title="Set Link">
        <LinkVariant />
      </button>
      <button type="button" @click="addImage" title="Add Image">
        <ImagePlus />
      </button>
      <div class="divider"></div>

      <!-- Group 6: History -->
      <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" title="Undo">
        <Undo />
      </button>
      <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" title="Redo">
        <Redo />
      </button>
    </section>

    <EditorContent :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.tiptap-container {
  border: 1px solid #9ca3af; // border-gray-400
  border-radius: 0.375rem; // rounded-md
  overflow: hidden;

  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f9fafb; // bg-gray-50
    border-bottom: 1px solid #9ca3af; // border-gray-400

    button {
      display: flex;
      align-items: center;
      padding: 0.25rem; // p-1
      border-radius: 0.25rem; // rounded
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: #374151; // text-gray-700
      transition: background-color 0.2s, color 0.2s;

      &:hover {
        background-color: #e5e7eb; // hover:bg-gray-200
      }

      &.is-active {
        background-color: #d1d5db; // bg-gray-300
        color: #111827; // text-gray-900
      }

      &:disabled {
        color: #9ca3af; // disabled:text-gray-400
        cursor: not-allowed;
      }
    }

    input[type="color"] {
        width: 28px;
        height: 28px;
        border: none;
        background: none;
        cursor: pointer;
        padding: 2px;
        border-radius: 4px;

        &:hover {
          background-color: #e5e7eb;
        }
    }

    .divider {
      width: 1px;
      height: 1.25rem;
      background-color: #d1d5db; // bg-gray-300
      margin-left: 0.25rem;
      margin-right: 0.25rem;
    }
  }
}

// Scoped styles for the Tiptap editor content
// Using :deep() to apply styles to the child elements generated by Tiptap
:deep(.tiptap) {
    &:focus {
      outline: none;
    }

    p {
      margin: 1rem 0;
    }

    > *:first-child {
      margin-top: 0;
    }

    /********** THE FIX IS HERE **********/
    /* List styles */
    ul,
    ol {
      margin: 1rem 0;
      padding: 0 0 0 2rem; /* Give lists some left padding for indentation */

      /* This is the key change: ensures markers are rendered inside the content flow */
      list-style-position: inside;

      li p {
        display: inline; /* Makes paragraph inside list item flow correctly */
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }
    /* Style differently for different list types if you want */
    ul {
      list-style-type: disc;
    }
    ol {
      list-style-type: decimal;
    }
    /********** END OF FIX **********/


    /* Heading styles */
    h1, h2, h3 {
      line-height: 1.1;
      margin-top: 2.5rem;
      margin-bottom: 1rem;
      text-wrap: pretty;
    }

    h1, h2 {
      margin-top: 3.5rem;
      margin-bottom: 1.5rem;
    }

    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.17em; }

    /* Code and preformatted text styles */
    code {
      background-color: #f1f1f1;
      border-radius: 0.4rem;
      color: #d63384;
      font-size: 0.85rem;
      padding: 0.25em 0.3em;
    }

    pre {
      background: #1e1e1e;
      border-radius: 0.5rem;
      color: #d4d4d4;
      font-family: 'JetBrainsMono', 'Courier New', monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;

      code {
        background: none;
        color: inherit;
        font-size: 0.85rem;
        padding: 0;
      }
    }

    blockquote {
      border-left: 3px solid #d1d5db;
      margin: 1.5rem 0;
      padding-left: 1rem;
      font-style: italic;
      color: #6b7280;
    }

    hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 2rem 0;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
    }

    u {
      text-decoration: underline;
    }
}
</style>
