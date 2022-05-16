import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, colors, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, RequiredIndicator, Select } from "@vechaiui/react";
import { DocumentIcon, ViewListIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSanctum } from "react-sanctum";
import axios from 'axios';

interface IActiveToken { id: number, tokenableId: number, name: string, createdAt: string, lastUsedAt: string };

export const Dashboard = () => {
    const { user, signOut } = useSanctum();
    const [transactionToken, setTransactionToken] = useState("");
    const [checkoutToken, setCheckoutToken] = useState("");
    const [tokensList, setTokensList] = useState<IActiveToken[]>([]);
    const getActiveTokens = async () => {
        await axios.get("http://localhost/sanctum/csrf-cookie");
        const result = await axios.get("http://localhost/api/tokens", { headers: { "Content-Type": "application/json" } })
        setTokensList(result.data.active_tokens.map((activeToken: any) => {
            const activeTokenProcessed: IActiveToken = { id: activeToken.id, createdAt: activeToken.created_at, lastUsedAt: activeToken.last_used_at, name: activeToken.name, tokenableId: activeToken.tokenable_id };
            return activeTokenProcessed;
        }));
    }
    useEffect(() => { getActiveTokens() }, []);
    // @ts-ignore
    const createToken = async (typeOfToken: string, setToken: React.Dispatch<React.SetStateAction<string>>) => {
        await axios.get("http://localhost/sanctum/csrf-cookie");
        const result = await axios.post("http://localhost/api/tokens/create", { "token_type": typeOfToken }, { headers: { "Content-Type": "application/json" } })
        setToken(result.data.token);
        await getActiveTokens();
    }
    return (

        <div className="full-height-custom flex flex-col h-screen justify-center items-center">
            <article className="prose lg:prose-xl">
            <h1>Hi {user.name}</h1>
            <h3>Actions</h3>
            <Button type="button" size="xs" variant="solid" onClick={() => createToken("checkout", setCheckoutToken)}>Generate Checkout API Token</Button>
            <br />
            {checkoutToken != "" ? <p>Your Checkout Token Is: {checkoutToken}</p> : <p></p>}
            <Button type="button" size="xs" variant="solid" onClick={() => createToken("transaction", setTransactionToken)}>Generate Transaction API Token</Button>
            <br />
            {transactionToken != "" ? <p>Your Transaction Token Is: {transactionToken}</p> : <p></p>}
            <br />
            <br />
            <h1>Active Tokens</h1>
            <table className="border-collapse border border-slate-500">
            <tr>
            <th className="border border-slate-600">Id</th>
            <th className="border border-slate-600">Name</th>
            <th className="border border-slate-600">Created At</th>
            <th className="border border-slate-600">Last Used At</th>
    </tr>
            {tokensList.map((token) =>
                (<tr>
                    <td className="border border-slate-700">
                        <Icon as={ViewListIcon} label="info" className="w-4 h-4 justify-center items-center" color={colors.yellow[500]} />{token.id}
                    </td>
                    <td className="border border-slate-700">
                        {token.name}
                    </td>
                    <td className="border border-slate-700">
                        {token.createdAt}
                    </td>
                    <td className="border border-slate-700">
                        {token.lastUsedAt}
                    </td>
                </tr>))}
            </table>
            <br />

            <Button type="button" size="xs" variant="solid" onClick={signOut}>Signout</Button>
            </article>

        </div>

    );
}
