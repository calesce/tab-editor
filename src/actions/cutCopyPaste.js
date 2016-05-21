export const CUT_NOTE = 'CUT_NOTE';
export const COPY_NOTE = 'COPY_NOTE';
export const PASTE_NOTE = 'PASTE_NOTE';

export function copyNote(selection) {
  return {
    type: COPY_NOTE,
    selection
  };
}

export function cutNote(index, selection, range) {
  return {
    type: CUT_NOTE,
    index,
    selection,
    range
  };
}

export function pasteNote(index, clipboard) {
  return {
    type: PASTE_NOTE,
    index,
    clipboard
  };
}
