import React, { UseState } from 'react';

const RegistrationForm = () => {
    // Form State
const [formData, setFormData] = UseState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
});

// Error State
const [errors, setErrors] = UseState({});

//Success State
const [isSubmitted, setIsSubmitted] = UseState(false);

// Handle input changes
const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
        ...formData,
        [name]: value
    });

    // Clear the error when the user begins to type again
    if (errors[name]) {
        setErrors({
            ...errors,
            [name]: null
        });
    }
};

// Validate a user's email adress:
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate a user's password - we can finish this later
// In the user schema, we have not even set a minlength or maxlength for password, no special characters either
//const validatePassword = (password) => {

//}

// Form submission handler
const handleSubmit = (e) => {
    e.preventDefault();
}

}