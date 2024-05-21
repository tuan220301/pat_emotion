import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { editCusState, formState, reloadState } from '../../Store/formStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function BarChart() {
    const form = useRecoilValue(formState);
    const edit = useRecoilValue(editCusState);
    const labels = ['Bình thường', 'Vui vẻ', 'Buồn bã', 'Tức giận', 'Sợ hãi', 'Ghê tởm', 'Ngạc nhiên'];
    const [couts, setCount] = useState([]);
    const reload = useRecoilValue(reloadState);
    // Đếm số lần xuất hiện của mỗi cảm xúc từ dữ liệu form.emotionData
    const emotionCount: any = {};
    useEffect(() => {
        console.log('edit: ', edit);
        console.log('form.emotionData: ', form.emotionData);
        if (edit) {
            form.emotionData.forEach(data => {
                console.log("🚀 ~ useEffect ~ data:", data);
                const { emotion } = data;
                if (emotionCount[emotion]) {
                    emotionCount[emotion]++;
                } else {
                    emotionCount[emotion] = 1;
                }
            });
            const countsClone: any = labels.map(label => emotionCount[label] || 0);
            setCount(countsClone);
        }
    }, [edit, reload]);



    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Emotion Count', // Tên của dữ liệu trong biểu đồ
                data: couts, // Số lần xuất hiện của mỗi cảm xúc
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Màu nền của cột
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
