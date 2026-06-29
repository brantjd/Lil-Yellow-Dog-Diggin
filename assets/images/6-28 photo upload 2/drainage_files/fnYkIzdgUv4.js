;/*FB_PKG_DELIM*/

__d("updatePostPlainTextForLexical",["LexicalText"],(function(t,n,r,o,a,i,l){"use strict";function e(e,t){if(e.lexicalEditor!=null){var n=e.lexicalEditor.getEditorState().read(o("LexicalText").$rootTextContent),r=n!=null&&n.trim()!=="";t(r?n:null)}else e.draftedPostText!=null&&t(e.draftedPostText)}l.default=e}),98);