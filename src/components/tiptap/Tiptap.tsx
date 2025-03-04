"use client";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MouseEvent, useState } from "react";
import "./tiptap-styles.css"; // We'll create this file

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  // Prevent button clicks from submitting the form
  const handleButtonClick = (e: MouseEvent, callback: () => void) => {
    e.preventDefault(); // Prevent default button action
    e.stopPropagation(); // Stop event bubbling
    callback(); // Execute the editor command
  };

  return (
    <div className="control-group">
      {/* Text formatting buttons */}
      <div className="button-group flex flex-wrap gap-1 rounded-md bg-gray-100 p-2">
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleBold().run(),
            )
          }
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("bold") ? "bg-blue-200" : "bg-white"
          }`}
          title="Bold"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleItalic().run(),
            )
          }
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("italic") ? "bg-blue-200" : "bg-white"
          }`}
          title="Italic"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleStrike().run(),
            )
          }
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`rounded px-2 py-1 ${
            editor.isActive("strike") ? "bg-blue-200" : "bg-white"
          }`}
          title="Strike"
        >
          Strike
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().unsetAllMarks().run(),
            )
          }
          className="rounded bg-white px-2 py-1"
          title="Clear formatting"
        >
          Clear marks
        </button>
      </div>

      {/* Heading buttons */}
      <div className="button-group mt-1 flex flex-wrap gap-1 rounded-md bg-gray-100 p-2">
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 4 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 4 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 4"
        >
          H4
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 5 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 5 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 5"
        >
          H5
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleHeading({ level: 6 }).run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("heading", { level: 6 })
              ? "bg-blue-200"
              : "bg-white"
          }`}
          title="Heading 6"
        >
          H6
        </button>
      </div>

      {/* Lists and special elements */}
      <div className="button-group mt-1 flex flex-wrap gap-1 rounded-md bg-gray-100 p-2">
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleBulletList().run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("bulletList") ? "bg-blue-200" : "bg-white"
          }`}
          title="Bullet List"
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleOrderedList().run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("orderedList") ? "bg-blue-200" : "bg-white"
          }`}
          title="Ordered List"
        >
          Ordered list
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().toggleBlockquote().run(),
            )
          }
          className={`rounded px-2 py-1 ${
            editor.isActive("blockquote") ? "bg-blue-200" : "bg-white"
          }`}
          title="Blockquote"
        >
          Blockquote
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().setHorizontalRule().run(),
            )
          }
          className="rounded bg-white px-2 py-1"
          title="Horizontal Rule"
        >
          Horizontal Rule
        </button>
      </div>

      {/* Undo/Redo */}
      <div className="button-group mt-1 flex flex-wrap gap-1 rounded-md bg-gray-100 p-2">
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () => editor.chain().focus().undo().run())
          }
          disabled={!editor.can().chain().focus().undo().run()}
          className="rounded bg-white px-2 py-1"
          title="Undo"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () => editor.chain().focus().redo().run())
          }
          disabled={!editor.can().chain().focus().redo().run()}
          className="rounded bg-white px-2 py-1"
          title="Redo"
        >
          Redo
        </button>
        <button
          type="button"
          onClick={(e) =>
            handleButtonClick(e, () =>
              editor.chain().focus().setHardBreak().run(),
            )
          }
          className="rounded bg-white px-2 py-1"
          title="Line Break"
        >
          Hard break
        </button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

interface TiptapProps {
  defaultContent?: string;
  name: string;
  label?: string;
  onChange?: (html: string) => void;
  error?: string;
}

const Tiptap = ({
  defaultContent = "",
  name,
  label,
  onChange,
  error,
}: TiptapProps) => {
  const [content, setContent] = useState(defaultContent);
  const id = `tiptap-${name}`; // Create a unique ID

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="rounded-md border">
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
          onUpdate={({ editor }) => {
            const html = editor.getHTML();
            setContent(html);
            if (onChange) {
              onChange(html);
            }
          }}
          editorProps={{
            attributes: {
              class:
                "prose prose-sm prose-ul:pl-5 prose-ol:pl-5 focus:outline-none p-4 min-h-[200px] max-w-none tiptap-editor",
              id: id, // Add ID for label association
            },
          }}
          immediatelyRender={false}
        >
          {/* Make sure the hidden input has a valid name and is properly associated with the editor */}
          <input
            type="hidden"
            id={id}
            name={name || "content"}
            value={content}
          />
        </EditorProvider>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Tiptap;
