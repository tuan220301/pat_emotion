import { useRecoilState, useSetRecoilState } from "recoil";
import { editCusState, formState, listCusState, reloadState } from "../../Store/formStore";

const ListCusComponent = () => {
    // const listCus = useRecoilValue(listCusState);
    const [listCus, setListCus] = useRecoilState(listCusState);
    // const [form, setForm] = useRecoilState(formState);
    const setForm = useSetRecoilState(formState);
    const setEdit = useSetRecoilState(editCusState);
    // const [edit, setEdit] = useRecoilState(editCusState);
    const [reload, setReload] = useRecoilState(reloadState);
    const handleDelete = (id: string) => {
        setListCus((prevList: any) => prevList.filter((cus: any) => cus.id !== id));
    };
    const handleEditCus = (cus: any) => {
        console.log('cus: ', cus);
        setForm(cus);
        setEdit(true);
        setReload(!reload);
    };
    return (
        <div className="w-full table-wrp block max-h-80 overflow-y-auto">
            <h1 className="text-xl font-bold">Danh sách khách hàng</h1>
            <table className="w-full border-collapse">
                <thead className="border-b bg-white sticky top-0">
                    <tr className="text-left">
                        <th className="p-2">Tên khách hàng</th>
                        <th className="p-2">Số điện thoại khách hàng</th>
                        <th className="p-2">Địa chỉ khách hàng</th>
                        <th className="p-2">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {listCus.map((cus: any, index: number) => (
                        <tr key={index} className="border-b cursor-pointer" onClick={() => handleEditCus(cus)}>
                            <td className="p-2">{cus.cusname}</td>
                            <td className="p-2">{cus.cusphone}</td>
                            <td className="p-2">{cus.cusaddress}</td>
                            <td className="p-2">
                                <button onClick={() => handleDelete(cus.id)}>
                                    <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListCusComponent;
