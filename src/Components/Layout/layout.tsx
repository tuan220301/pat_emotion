import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formState, reloadState } from "../../Store/formStore";

type LayoutProps = {
    videoChildren: React.ReactNode;
    columnChartChildren?: React.ReactNode;
    formChildrens?: React.ReactNode;
    listCustomerChildren?: React.ReactNode;
};
export const Layout = (props: LayoutProps) => {
    const { videoChildren, columnChartChildren, formChildrens, listCustomerChildren } = props;
    // const [form, setForm] = useRecoilState(formState);
    const setForm = useSetRecoilState(formState);
    const [reload, setReload] = useRecoilState(reloadState);
    const handleReset = () => {
        setReload(!reload);
        setForm({
            id: '',
            cusname: '',
            cusphone: '',
            cusaddress: '',
            video: null,
            emotionData: []
        });
    };
    return (
        <div className="p-4">
            <div className="w-full h-20 flex items-center justify-center">
                <div className="w-[60%] flex items-center justify-between">
                    <h1 className="text-3xl font-bold">PAT Tích hợp AI phân tích cảm xúc</h1>
                    <button
                        onClick={handleReset}
                        className="flex items-center justify-between">
                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                        </svg>
                    </button>

                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="w-[40%] shadow-md rounded-md">
                    <div className="w-full">
                        {videoChildren}
                    </div>
                </div>
                <div className="w-[55%] shadow-md rounded-md ">
                    <div className="w-full flex items-center">
                        {columnChartChildren}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <div className="w-[40%] shadow-md rounded-md p-2">
                    {formChildrens}
                </div>
                <div className="w-[55%] h-80 shadow-md rounded-md p-2">
                    {listCustomerChildren}
                </div>
            </div>

        </div>
    );
};