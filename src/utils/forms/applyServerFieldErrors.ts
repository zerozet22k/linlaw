import type { FormInstance } from "antd";

export const applyServerFieldErrors = (
  form: FormInstance,
  fieldErrors?: Record<string, string>
) => {
  if (!fieldErrors || !Object.keys(fieldErrors).length) return false;

  form.setFields(
    Object.entries(fieldErrors).map(([name, message]) => ({
      name,
      errors: [message],
    }))
  );

  return true;
};
