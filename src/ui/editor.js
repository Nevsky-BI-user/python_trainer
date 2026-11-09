// Редактор коду (CodeMirror 6) і статичне підсвічування прикладів тим самим парсером.
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import {
  EditorView,
  Decoration,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  highlightSpecialChars,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { python, pythonLanguage } from '@codemirror/lang-python';
import { syntaxHighlighting, indentOnInput, bracketMatching, indentUnit } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { highlightCode, classHighlighter } from '@lezer/highlight';

const setErrorLine = StateEffect.define();
const errorLineMark = Decoration.line({ class: 'cm-error-line' });

const errorLineField = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    if (tr.docChanged) return Decoration.none;
    for (const e of tr.effects) {
      if (e.is(setErrorLine)) {
        const n = e.value;
        if (!n || n > tr.state.doc.lines) return Decoration.none;
        return Decoration.set([errorLineMark.range(tr.state.doc.line(n).from)]);
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const theme = EditorView.theme({
  '&': { backgroundColor: 'var(--code-bg)', color: 'var(--code-fg)', fontSize: '13.5px' },
  '.cm-content': { fontFamily: 'var(--font-mono)', padding: '10px 0', caretColor: 'var(--accent)' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
  '.cm-gutters': { backgroundColor: 'var(--code-gutter)', color: 'var(--muted)', border: 'none', borderRight: '1px solid var(--line)' },
  '.cm-activeLine': { backgroundColor: 'var(--code-active)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--code-active)', color: 'var(--ink)' },
  '&.cm-focused': { outline: 'none' },
  '.cm-cursor': { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'var(--code-selection) !important' },
  '.cm-matchingBracket': { backgroundColor: 'var(--code-bracket)', outline: 'none' },
  '.cm-error-line': { backgroundColor: 'var(--err-line)' },
});

/**
 * Створює редактор. onRun/onCheck викликаються з Ctrl+Enter і Ctrl+Shift+Enter.
 * Повертає { view, getValue, setValue, markError, focus }.
 */
export function createEditor(parent, { doc = '', onChange, onRun, onCheck, label = 'Редактор коду' } = {}) {
  const runKeys = keymap.of([
    { key: 'Mod-Enter', run: () => (onRun?.(), true) },
    { key: 'Mod-Shift-Enter', run: () => (onCheck?.(), true) },
  ]);

  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        runKeys,
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        python(),
        syntaxHighlighting(classHighlighter),
        errorLineField,
        theme,
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChange?.(u.state.doc.toString());
        }),
      ],
    }),
  });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue(text) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
    },
    markError(line) {
      view.dispatch({ effects: setErrorLine.of(line || null) });
    },
    focus: () => view.focus(),
  };
}

/** Підсвічений код у <pre><code> без редактора (для прикладів і розв'язків). */
export function highlightedBlock(code) {
  const pre = document.createElement('pre');
  pre.className = 'code-static';
  const el = document.createElement('code');
  const tree = pythonLanguage.parser.parse(code);
  highlightCode(
    code,
    tree,
    classHighlighter,
    (text, classes) => {
      if (classes) {
        const span = document.createElement('span');
        span.className = classes;
        span.textContent = text;
        el.appendChild(span);
      } else {
        el.appendChild(document.createTextNode(text));
      }
    },
    () => el.appendChild(document.createTextNode('\n')),
  );
  pre.appendChild(el);
  return pre;
}
