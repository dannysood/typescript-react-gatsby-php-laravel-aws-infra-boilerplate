import React from 'react';
import { useForm } from "react-hook-form";
import { Button, colors, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, RequiredIndicator, Select } from "@vechaiui/react";
import { LoginIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSanctum } from "react-sanctum";

export const Dashboard = () => {



    const { authenticated, signOut } = useSanctum();
    // @ts-ignore

    return (
        <div className="full-height-custom flex flex-col h-screen justify-center items-center">
            <Icon as={LoginIcon} label="info" className="w-16 h-16 justify-center items-center" color={colors.yellow[500]}/>
            <Button type="button" size="xs" variant="solid" onClick={signOut}>Signout</Button>

        </div>

    );
}
