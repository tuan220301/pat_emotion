import { atom } from "recoil";
export type EmotionDataType = {
    emotion: string,
    time: number;
};

export const formState = atom({
    key: 'formState',
    default: {
        id: '',
        cusname: '',
        cusphone: '',
        cusaddress: '',
        video: null,
        emotionData: [] as EmotionDataType[]
    },
});


export const listCusState = atom({
    key: 'listCusState',
    default: [] as any
});

export const editCusState = atom({
    key: 'editCusState',
    default: false
});

export const reloadState = atom({
    key: 'reloadState',
    default: false
});