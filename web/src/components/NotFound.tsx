import React from 'react';
import { useForm } from "react-hook-form";
import { Button, colors, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, RequiredIndicator, Select } from "@vechaiui/react";
import { BanIcon } from '@heroicons/react/solid'

export const NotFound = () => {
    return (
        <div className="full-height-custom flex flex-col h-screen justify-center items-center">
            <Icon as={BanIcon} label="info" className="w-16 h-16 justify-center items-center" color={colors.red[400]}/>
            <div className="w-16 h-16 justify-center items-center" color={colors.red[400]}>


                <p className='text-center'>Invalid Path</p>

            </div>
        </div>

    );
}
