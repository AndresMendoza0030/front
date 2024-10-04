// src/components/ConfigForm.js
import React from 'react';
import '../pages/UserPermissions.css';

const ConfigForm = ({ title, action, fields }) => {
    return (
        <div className="config-form">
            <h2>{title}</h2>
            <form method="POST" action={action}>
                {fields.map((field) => (
                    <div className="form-group" key={field.id}>
                        <label htmlFor={field.id} className="form-label">{field.label}</label>
                        <input
                            type={field.type}
                            id={field.id}
                            name={field.name}
                            className="form-control"
                            required={field.required}
                            min={field.min}
                        />
                    </div>
                ))}
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" className="submit-button">{title}</button>
                </div>
            </form>
        </div>
    );
};

export default ConfigForm;
