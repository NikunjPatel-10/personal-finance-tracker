export interface ISignUpForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    passwordHash: string;
    confirmPassword?: string;
}

export interface ISignUpFormProps {
    onSignUpSubmit: (values: ISignUpForm) => void;
    resetForm: boolean
}

export interface IBaseResponse<T> {
    data: T;
    message: string;
    error: boolean
}
