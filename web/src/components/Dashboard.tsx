import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, colors, FormControl, FormErrorMessage, FormHelperText, FormLabel, Icon, Input, RequiredIndicator, Select } from "@vechaiui/react";
import { DocumentIcon, ViewListIcon } from '@heroicons/react/solid'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSanctum } from "react-sanctum";
import axios from 'axios';
import {DateTime} from "luxon";

interface IActiveToken { id: number, tokenableId: number, name: string, createdAt: DateTime, lastUsedAt: DateTime|undefined, validTill: DateTime, status: "active"|"expired" };

export const Dashboard = () => {
    const { user, signOut } = useSanctum();
    const [activeToken, setActiveToken] = useState("");
    const [activeTokenMessage, setActiveTokenMessage] = useState("");
    const [transactionToken, setTransactionToken] = useState("");
    const [checkoutToken, setCheckoutToken] = useState("");
    const [tokensList, setTokensList] = useState<IActiveToken[]>([]);
    const getActiveTokens = async () => {
        await axios.get("http://localhost/sanctum/csrf-cookie");
        const result = await axios.get("http://localhost/api/tokens", { headers: { "Content-Type": "application/json" } })
        setTokensList(result.data.active_tokens.reverse().map((activeToken: any) => {
                const createdAt = DateTime.fromISO(activeToken.created_at);
                const validTill = DateTime.fromISO(activeToken.created_at).plus({minutes: 5});
            const activeTokenProcessed: IActiveToken = { id: activeToken.id, createdAt: createdAt, lastUsedAt: activeToken.last_used_at ? DateTime.fromISO(activeToken.last_used_at) : undefined, name: activeToken.name, tokenableId: activeToken.tokenable_id, validTill: validTill, status: validTill < DateTime.now() ? "expired" : "active" };
            return activeTokenProcessed;
        }));
    }
    const deleteTokenToken = async (id: number) => {
        await axios.get("http://localhost/sanctum/csrf-cookie");
        await axios.delete(`http://localhost/api/token/${id}`, { headers: { "Content-Type": "application/json" } })
        await getActiveTokens();
    }
    useEffect(() => { getActiveTokens() }, []);
    // @ts-ignore
    const createToken = async (typeOfToken: string, setToken: React.Dispatch<React.SetStateAction<string>>) => {
        await axios.get("http://localhost/sanctum/csrf-cookie");
        const result = await axios.post("http://localhost/api/tokens", { "token_type": typeOfToken }, { headers: { "Content-Type": "application/json" } })
        setToken(result.data.token);
        setActiveToken(result.data.token);
        await getActiveTokens();
    }

    const getCheckoutUrlFromToken = async () => {
        try {
            await axios.get("http://localhost/sanctum/csrf-cookie");
            const result = await axios.post("http://localhost/api/checkout", {}, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${activeToken}` } })
            setActiveTokenMessage(result.data.url);
        } catch($e) {
            setActiveTokenMessage("failed");
        }



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
            <h1>Active Token</h1>
            <p>{activeToken}</p>
            <Button type="button" size="xs" variant="solid" onClick={getCheckoutUrlFromToken}>Fetch Checkout Url From Active Token</Button>
            {activeTokenMessage}
            <br />
            <br />
            <h1>Tokens List</h1>
            <table className="border-collapse border border-slate-500">
            <tr>
            <th className="border border-slate-600">Id</th>
            <th className="border border-slate-600">Name</th>
            <th className="border border-slate-600">Created At</th>
            <th className="border border-slate-600">Valid Till</th>
            <th className="border border-slate-600">Last Used At</th>
            <th className="border border-slate-600">Status</th>
            <th className="border border-slate-600">Actions</th>
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
                        {token.createdAt.toLocaleString(DateTime.DATETIME_FULL)}
                    </td>
                    <td className="border border-slate-700">
                        {token.validTill.toLocaleString(DateTime.DATETIME_FULL)}
                    </td>
                    <td className="border border-slate-700">
                        {token.lastUsedAt?.toLocaleString(DateTime.DATETIME_FULL)}
                    </td>
                    <td className="border border-slate-700">
                        {token.status}
                    </td>
                    <td className="border border-slate-700">
                    <Button type="button" size="xs" variant="solid" onClick={() => deleteTokenToken(token.id)}>Delete</Button>
                    </td>
                </tr>))}
            </table>
            <br />

            <Button type="button" size="xs" variant="solid" onClick={signOut}>Signout</Button>
            </article>

        </div>

    );
}
