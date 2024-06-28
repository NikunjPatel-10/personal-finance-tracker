import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../shared/utility/services/axiosBaseQuery.service";
import { ISignUpForm } from "../models/signUp.model";
import { baseUrl } from "../../../environments/environment";
import { Constants } from "../../../shared/utility/constants/shared.constant";

export const signUpApi = createApi({
    reducerPath: "signUpApi",
    tagTypes: ["SignUp"],
    baseQuery: axiosBaseQuery({
        baseUrl: baseUrl
    }),
    endpoints: (build) => ({
        signUpSubmit: build.mutation<any, ISignUpForm>({
            query: (signUpDetails: ISignUpForm) => ({
                url: Constants.END_POINTS.REGISTER,
                method: "POST",
                data: signUpDetails
            }),
            invalidatesTags: ["SignUp"]
        })
    }),
})

export const {
    useSignUpSubmitMutation
} = signUpApi;