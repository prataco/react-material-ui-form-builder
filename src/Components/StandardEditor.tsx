import get from "lodash/get";
import React, { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { CommonFieldProps, RichTextFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";

export interface StandardEditorProps
  extends CommonFieldProps<"rich-text">,
    RichTextFieldProps {
  attribute: Required<CommonFieldProps<"rich-text">>["attribute"];
}

export default function StandardEditor(props: {
  field: StandardEditorProps;
  methods: UseFormReturn;
}) {
  const {
    field: fieldConfig,
    methods: {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    },
  } = props;
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    if (touched) {
      trigger(fieldConfig.attribute);
    }
  }, [touched]);

  return (
    <Controller
      name={fieldConfig.attribute}
      control={control}
      render={({ field }) => (
        <div onFocus={() => setTouched(true)}>
          <CKEditor
            editor={ ClassicEditor }
            data={field.value || '' }
            onChange={(e, editor) => setValue(fieldConfig.attribute, editor.data)}
            containerProps={fieldConfig.groupContainerProps}
            editableProps={fieldConfig.props}
          />
          {!!get(errors, fieldConfig.attribute) && (
            //@ts-ignore
            <ErrorText error={get(errors, fieldConfig.attribute)?.message} />
          )}
        </div>
      )}
    />
  );
}
