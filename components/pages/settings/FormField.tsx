import React from 'react';

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => {
    
    const childWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
             const defaultClasses = "block w-full p-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-primary focus:border-primary dark:placeholder-gray-400";
             const childProps = child.props as any;
             // Don't apply default styles to file or color inputs
             if (childProps.type === 'file' || childProps.type === 'color') {
                return child;
             }
             return React.cloneElement(child as React.ReactElement<any>, {
                className: `${defaultClasses} ${childProps.className || ''}`
            });
        }
        return child;
    });

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                {label}
            </label>
            {childWithProps}
        </div>
    );
};

export default FormField;
