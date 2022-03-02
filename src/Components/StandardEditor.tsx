import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { EditableProps } from "slate-react/dist/components/editable";

import { Editor } from "@jeremyling/react-material-ui-rich-text-editor";

import { CommonFieldProps, RichTextFieldProps } from "./props/FieldProps";
import ErrorText from "./widgets/ErrorText";

export interface StandardEditorProps
  extends CommonFieldProps,
    RichTextFieldProps {
  attribute: Required<CommonFieldProps>["attribute"];
  props: EditableProps;
}

const StandardEditor = (
  (props: { field: StandardEditorProps; showTitle: boolean }) => {
    const {
      control,
      getValues,
      setValue,
      trigger,
      formState: { errors },
    } = useFormContext();
    const { field: fieldConfig } = props;
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
        defaultValue={getValues(fieldConfig.attribute) || 0}
        render={({ field }) => (
          <div onFocus={() => setTouched(true)}>
            <Editor
              html={field.value}
              updateHtml={(html: string) =>
                setValue(fieldConfig.attribute, html)
              }
              containerProps={fieldConfig.groupContainerProps}
              editableProps={fieldConfig.props}
            />
            {errors?.length > 0 && <ErrorText error={errors[0]} />}
          </div>
        )}
      />
    );
  }
);

export { StandardEditor };