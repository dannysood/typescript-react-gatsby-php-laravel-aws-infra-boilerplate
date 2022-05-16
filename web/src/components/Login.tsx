import React from 'react';
import { useForm } from "react-hook-form";
import { Button, colors, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, RequiredIndicator, Select } from "@vechaiui/react";
import { LoginIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSanctum } from "react-sanctum";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [loading, setLoading] = React.useState(false);
    const [isShowPassword, setIsShowPassword] = React.useState(false)
    const [isLoginFailed, setIsLoginFailed] = React.useState(false)
    const { signIn } = useSanctum();
    const navigate = useNavigate();

    const handleToggleShowPassword = () => setIsShowPassword(!isShowPassword)

    const schema = yup.object({
        email: yup.string().required().email().lowercase(),
        password: yup.string().required().min(5).max(30).matches(RegExp("^[a-zA-Z0-9_]*$"), "password can only contain alphabets, numbers and underscore character"),
      }).required();

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    });
    // @ts-ignore
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            setLoading(false);
            navigate("/home");
        } catch(error) {
            setIsLoginFailed(true);
            setLoading(false);
        }

        // setTimeout(() => {
        //     alert(JSON.stringify(data));
        //     setIsLoginFailed(true);
        //     setLoading(false);
        // }, 1000);
    };

    return (
        <div className="full-height-custom flex flex-col h-screen justify-center items-center">
            <Icon as={LoginIcon} label="info" className="w-16 h-16 justify-center items-center" color={colors.yellow[500]}/>
            <div className=" w-96 max-w-xs p-8 space-x-4">


                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormControl invalid={Boolean(errors.email)}>
                        <FormLabel>
                            Email<RequiredIndicator />
                        </FormLabel>
                        <Input {...register("email")} placeholder="Enter your email." />
                        {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                    </FormControl>

                    <FormControl invalid={Boolean(errors.password)}>
                        <FormLabel>
                            Password<RequiredIndicator />
                        </FormLabel>
                        <Input.Group>
                            <Input
                                className="pr-16"
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...register("password")}
                            />
                            <Input.RightElement className="w-16">
                                <Button type="button" size="xs" variant="solid" onClick={handleToggleShowPassword}>
                                    {isShowPassword ? "Hide" : "Show"}
                                </Button>
                            </Input.RightElement>
                        </Input.Group>
                        {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                    </FormControl>
                    {isLoginFailed && <FormErrorMessage>Login Failed</FormErrorMessage>}


                    <Button type="submit" variant="solid" color="primary" loading={loading}>Submit</Button>
                </form>

            </div>
        </div>

    );
}
