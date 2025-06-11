<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
// --- Only import extensions NOT in StarterKit ---
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { watch } from 'vue'

// Import all the necessary icons (this part is correct)
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
import Undo from 'vue-material-design-icons/Undo.vue'
import Redo from 'vue-material-design-icons/Redo.vue'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    // Use StarterKit as the base and configure it
    StarterKit.configure({
      // Heading, BulletList, OrderedList, etc., are all configured here
      heading: {
        levels: [1, 2, 3],
      },
    }),
    // Now, add the extensions that are NOT part of StarterKit
    TextStyle,
    Color,
    Underline,
    Image,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
  ],
  editorProps: {
    attributes: {
      // Small UI improvement: remove top border to merge with toolbar, add dark mode prose
      class: 'border-t-0 p-4 min-h-[40rem] max-h-[50rem] overflow-y-auto outline-none prose dark:prose-invert max-w-none focus:outline-none',
    },
  },
})

// Watch for changes in the v-model and update the editor content accordingly
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() === newValue) {
    return
  }
  editor.value?.commands.setContent(newValue, false)
})

// --- Logic for Links and Images ---
const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return; // User cancelled
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('Image URL');
  if (url) {
    // Create image HTML with inline CSS
    const imgHtml = `<img src="${url}" style="width: 100%; max-width: 100%; height: auto; object-fit: contain;" />`;
    editor.value.chain().focus().insertContent(imgHtml).run();
  }
}

const setTextColor = (color) => {
  editor.value.chain().focus().setColor(color).run()
}
</script>

<template>
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
      <input type="color" @input="setTextColor($event.target.value)" :value="editor.getAttributes('textStyle').color" />

      <!-- Group 2: Headings & Paragraph -->
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        <FormatHeader1 />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        <FormatHeader2 />
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
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
      <div class="divider"></div>

      <!-- Group 4: Lists -->
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <FormatListBulleted />
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
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

    .divider {
      width: 1px;
      height: 1.25rem;
      background-color: #d1d5db; // bg-gray-300
      margin-left: 0.25rem;
      margin-right: 0.25rem;
    }
  }
}
</style>
