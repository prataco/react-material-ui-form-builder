declare module "@ckeditor/ckeditor5-react" {
  export interface EditorProps {
    data: string;
    editor: any,
    onChange?: (event: any, editor: any) => void;
    containerProps?: import("@mui/material").PaperProps;
    editableProps?: import("slate-react/dist/components/editable").EditableProps;
  }

  export const CKEditor: React.FunctionComponent<EditorProps>;
}

// declare namespace React {
//   function lazy<T extends ComponentType<any>>(
//     factory: () => Promise<{ default: T }>
//   ): T;
// }
