import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { formState, listCusState } from "../../Store/formStore";
import { v4 as uuidv4 } from 'uuid';
const FormComponent = () => {
    const [form, setForm] = useRecoilState(formState);
    const setListCus = useSetRecoilState(listCusState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCustomer = { ...form, id: uuidv4() };
        setListCus((prevList: any) => [...prevList, newCustomer]);
        // Reset form state after submission
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
        <div className="w-full flex-col gap-8 h-[300px]">
            <div className="w-full flex justify-between items-center p-2">
                <h1 className="text-xl font-bold">Thông tin khách hàng</h1>
                <button
                    onClick={handleSubmit}
                    className='px-4 py-2 bg-green-500 text-white rounded'>Lưu</button>
            </div>
            <div className="w-full flex justify-between items-center p-2">
                <label>Tên khách hàng</label>
                <input
                    className="w-1/2 border-gray-400 border-[1px] rounded-md p-2"
                    type='text'
                    name='cusname'
                    value={form.cusname}
                    onChange={handleInputChange}
                />
            </div>
            <div className="w-full flex justify-between items-center p-2">
                <label>Số điện thoại khách hàng</label>
                <input
                    type='text'
                    className="w-1/2 border-gray-400 border-[1px] rounded-md p-2"
                    name='cusphone'
                    value={form.cusphone}
                    onChange={handleInputChange}
                />
            </div>
            <div className="w-full flex justify-between items-center p-2">
                <label>Địa chỉ khách hàng</label>
                <input
                    className="w-1/2 border-gray-400 border-[1px] rounded-md p-2"
                    type='text'
                    name='cusaddress'
                    value={form.cusaddress}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default FormComponent;
