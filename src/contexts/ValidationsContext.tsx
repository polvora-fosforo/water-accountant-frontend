import React, { ReactNode, createContext, useState } from 'react';

interface ValidationsProviderProps {
  children: ReactNode;
}

interface defaultObjProperties {
  isValid: boolean | null;
  message: string | null;
}

interface CustomValidationsType {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  name: string | null;
  weight: string | null;
  measure: string | null;
}

interface ValidationsContextData {
  emailObj: defaultObjProperties;
  passwordObj: defaultObjProperties;
  confirmPasswordObj: defaultObjProperties;
  nameObj: defaultObjProperties;
  weightObj: defaultObjProperties;
  measureObj: defaultObjProperties;
  customValidations: CustomValidationsType;
  validateEmail: (email) => void;
  validatePassword: (password) => void;
  validateName: (name) => void;
  validateWeight: (weight) => void;
  validatePasswordEquality: (password, confirmPassword) => void;
  validateMeasure: (measure) => void;
  resetValidations: () => void;
  setCustomErrorMessage: (name: string, message: string) => void;
}

export const ValidationsContext = createContext({} as ValidationsContextData);

export function ValidationsProvider({ children }: ValidationsProviderProps): JSX.Element {
  const defaultObj: defaultObjProperties = { isValid: null, message: null };

  const [emailObj, setEmailObj] = useState(defaultObj);
  const [passwordObj, setPasswordObj] = useState(defaultObj);
  const [confirmPasswordObj, setConfirmPasswordObj] = useState(defaultObj);
  const [nameObj, setNameObj] = useState(defaultObj);
  const [weightObj, setWeightObj] = useState(defaultObj);
  const [measureObj, setMeasureObj] = useState(defaultObj);

  const defaultCustomValidations = {
    email: null,
    password: null,
    confirmPassword: null,
    name: null,
    weight: null,
    measure: null,
  };
  const [customValidations, setCustomValidations] = useState(defaultCustomValidations);

  const resetValidations = () => {
    setCustomValidations(defaultCustomValidations);
  };

  const setCustomErrorMessage = (name, message) => {
    const newCustomValidations = {
      ...customValidations,
      [name]: message,
    };
    setCustomValidations(newCustomValidations);
  };

  /* const validateEmail = (email) => {
    if (!email) {
      const newEmailObj = {
        isValid: false,
        message: 'No e-mail was provided',
      };
      setEmailObj(newEmailObj);
      return;
    }

    if (typeof email !== 'string') {
      const newEmailObj = {
        isValid: false,
        message: 'No e-mail was provided',
      };
      setEmailObj(newEmailObj);
      return;
    }

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = emailRegexp.test(email);

    if (!emailIsValid) {
      const newEmailObj = {
        isValid: false,
        message: 'Invalid user e-mail',
      };
      setEmailObj(newEmailObj);
      return;
    }

    setEmailObj({ isValid: true, message: null });
  }; */

  const validateEmail = (email) => {
    if (!email) {
      return 'No e-mail was provided';
    }

    if (typeof email !== 'string') {
      return 'E-mail must be a string';
    }

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailIsValid = emailRegexp.test(email);

    if (!emailIsValid) {
      return 'Invalid user e-mail';
    }

    return false;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'No password was provided';
    }

    if (typeof password !== 'string') {
      return 'Password must be a string';
    }

    // Strong password strength:
    /*
    ^ ----------------------- Start anchor
    (?=.*[A-Z].*[A-Z]) ------ Ensure string has at least two uppercase letters.
    (?=.*[!@#$&*]) ---------- Ensure string has at least one special case letter.
    (?=.*[0-9].*[0-9]) ------ Ensure string has at least two digits.
    (?=.*[a-z].*[a-z]) ------ Ensure string has at least two lowercase letters.
    .{8,} ------------------- Ensure string has at least a length of 8...
                              ...(to complete 8, the password must have at least...
                              ...one type opf character with more than 2 occurrences).
    $ ----------------------- End anchor.
    */
    const strongPassRegexp = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z]).{8,}$/;
    const passIsStrong = strongPassRegexp.test(password);

    if (passIsStrong) {
      return false;
    }

    // Medium password strength:
    /*
    ^ ----------------------- Start anchor
    (?=.*[A-Z]) ------------- Ensure string has at least one uppercase letters.
    (?=.*[!@#$&*]) ---------- Ensure string has at least one special case letter.
    (?=.*[0-9]) ------------- Ensure string has at least one digit.
    (?=.*[a-z]) ------------- Ensure string has at least one lowercase letters.
    .{8,} ------------------- Ensure string  at least a length of 8.
    $ ----------------------- End anchor.
    */
    const mediumPassRegexp = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    const passIsMedium = mediumPassRegexp.test(password);

    if (passIsMedium) {
      return false;
    }

    return 'Weak user password. A Password must have 8 characters length, at least one uppercase letter, one lowercase letter, one number and one special case letter';
  };

  const validatePasswordEquality = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Confirm password is empty';
    }

    if (password !== confirmPassword) {
      return 'Password and Confirm Password fields must be the same';
    }

    return false;
  };

  const validateName = async (name) => {
    if (!name) {
      return 'No name was provided';
    }

    if (typeof name !== 'string') {
      return 'Name must be a string';
    }

    const strName = name.replace(/\s\s+/g, '').trim();
    const namingPattern = /^[A-Za-z ,.'-]+$/;

    if (namingPattern.test(strName)) {
      return false;
    }

    return 'Invalid user name';
  };

  const validateMeasure = (measure) => {
    if (!measure) {
      return 'No measure was provided';
    }

    if (typeof measure !== 'number') {
      return 'Measure must be a number';
    }

    if (measure <= 0) {
      return 'Invalid measure';
    }

    return false;
  };

  const validateWeight = (weight) => {
    if (!weight) {
      return 'No weight was provided';
    }

    if (typeof weight !== 'number') {
      return 'Weight must be a number';
    }

    if (weight <= 0 || weight > 500) {
      return 'Invalid weight';
    }

    return false;
  };

  return (
    <ValidationsContext.Provider value={{
      emailObj,
      passwordObj,
      confirmPasswordObj,
      nameObj,
      weightObj,
      measureObj,
      validateEmail,
      validatePassword,
      validateName,
      validateWeight,
      validatePasswordEquality,
      validateMeasure,
      customValidations,
      resetValidations,
      setCustomErrorMessage,
    }}
    >
      {children}
    </ValidationsContext.Provider>
  );
}
