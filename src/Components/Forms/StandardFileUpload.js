import React, { Fragment, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { ButtonBase, Grid, makeStyles, Typography } from "@material-ui/core";
import _ from "lodash";
import useValidation from "../../Hooks/useValidation";
import { getValidations } from "../../Helpers";

const fileTypes = [
  ".pdf",
  ".doc",
  ".docx",
  ".xml",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls",
  ".xlsx",
  ".csv",
  "image/*",
  "audio/*",
  "video/*",
];

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    textAlign: "center",
  },
  imageContainerRoot: {
    display: "inline-block",
    position: "relative",
    width: "150px",
  },
  imageSizer: {
    marginTop: "100%",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  input: {
    textAlign: "start",
    border: (errors) =>
      `1px solid ${errors.length > 0 ? theme.palette.error.main : "#b9b9b9"}`,
    borderRadius: "4px",
    width: "100%",
    padding: "7px 10px",
    color: "rgba(0, 0, 0, 0.87)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    margin: theme.spacing(1, 0),
  },
  buttonBase: {
    width: "100%",
    display: "block",
  },
}));

export default function StandardFileUpload(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { field, form, updateForm } = props;
  const { errors, validate } = useValidation("mixed", getValidations(field));
  const classes = useStyles({ errors: errors });

  const [imageUrls, setImageUrls] = useState([]);

  const files = useMemo(() => {
    if (_.get(form, field.attribute)) {
      if (_.isArray(_.get(form, field.attribute))) {
        return _.get(form, field.attribute);
      }
      return [_.get(form, field.attribute)];
    }
    return [];
  }, [form, field.attribute]);

  const maxSizeMb = useMemo(() => {
    return field.maxSizeMb || 2;
  }, [field.maxSizeMb]);

  const acceptTypes = useMemo(() => {
    if (_.isString(field.acceptTypes)) {
      return field.acceptTypes;
    }
    if (_.isArray(field.acceptTypes)) {
      return _.concat(field.acceptTypes);
    }
    return _.concat(fileTypes);
  }, [field.acceptTypes]);

  const attachFiles = (files) => {
    if (files.length < 1) {
      enqueueSnackbar("Nothing selected", { variant: "error" });
      return;
    }

    var input = [];
    var imageUrls = [];
    for (const file of files) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        enqueueSnackbar("File should be less than " + maxSizeMb + " MB", {
          variant: "error",
        });
        continue;
      }
      input.push(file);

      const url = URL.createObjectURL(file);
      imageUrls.push(url);
    }

    // If not multiple, there should be only 1 file
    if (!(field.props || {}).multiple) {
      input = input[0];
    }

    updateForm(field.attribute, input);
    setImageUrls(imageUrls);
  };

  const componentProps = (field) => {
    return {
      id: field.id || field.attribute,
      type: "file",
      hidden: true,
      multiple: false,
      accept: acceptTypes,
      onChange: (event) => attachFiles(event.target.files),
      ...field.props,
    };
  };

  return (
    <Fragment>
      {field.title && (
        <Typography {...field.titleProps}>{field.title}</Typography>
      )}
      <input {...componentProps(field)} />
      <label
        htmlFor={componentProps(field).id}
        onBlur={(event) => validate(_.get(form, field.attribute))}
      >
        {files.length > 0 ? (
          <ButtonBase className={classes.buttonBase} component="div">
            {files.map((file, index) => (
              <div className={classes.inputRoot} key={index}>
                {field.imageUrl && (
                  <div
                    item
                    className={classes.imageContainerRoot}
                    style={{
                      width: (field.imageSize || [])[0],
                      height: (field.imageSize || [])[1],
                    }}
                  >
                    <div className={classes.imageSizer} />
                    <div className={classes.imageContainer}>
                      <img
                        src={
                          (imageUrls || [])[index] ||
                          (field.imageUrl || [])[index]
                        }
                        alt={
                          field.label ? `${field.label} ${index}` : file.name
                        }
                        loading="lazy"
                        className={classes.image}
                      />
                    </div>
                  </div>
                )}
                <Typography className={classes.input}>{file.name}</Typography>
              </div>
            ))}
          </ButtonBase>
        ) : (
          <ButtonBase className={classes.buttonBase} component="div">
            <div className={classes.inputRoot}>
              {field.imageUrl && (
                <div
                  className={classes.imageContainerRoot}
                  style={{
                    width: (field.imageSize || [])[0],
                    height: (field.imageSize || [])[1],
                  }}
                >
                  <div className={classes.imageSizer} />
                  <div className={classes.imageContainer}>
                    <img
                      src={imageUrls[0] || field.imageUrl}
                      alt={field.label || files[0].name}
                      loading="lazy"
                      className={classes.image}
                    />
                  </div>
                </div>
              )}
              <Typography
                style={{ color: "#777777" }}
                className={classes.input}
              >
                {field.label}
              </Typography>
            </div>
          </ButtonBase>
        )}
        {errors.length > 0 && (
          <Typography className={classes.errorText}>{errors[0]}</Typography>
        )}
      </label>
    </Fragment>
  );
}

StandardFileUpload.defaultProps = {
  updateForm: () => {},
};

StandardFileUpload.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func,
};
