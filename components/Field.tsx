import React, { forwardRef } from 'react';
import { Field as FormikField, FieldProps } from 'formik';
import Input from '@components/Input';

interface CustomFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
    name: string;
    label: string;
}

const Field = ({name, label, ...props}: CustomFieldProps) => {
    return <FormikField name={name}>
        {({field, meta}: FieldProps) => (
            <Input label={label} errors={meta.touched && meta.error ? meta.error : undefined} {...field} {...props} />
        )}
    </FormikField>
}


export default Field;