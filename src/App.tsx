import VideoComponent from './Components/VideoComponents/VideoComponent';
import { RecoilRoot } from 'recoil';
import { Layout } from './Components/Layout/layout';
import { BarChart } from './Components/Charts/BarChart';
import FormComponent from './Components/FormComponent/formComponent';
import ListCusComponent from './Components/ListCusComponent/ListCusComponent';

function App() {

  return (
    <>
      <RecoilRoot>
        <Layout
          videoChildren={<VideoComponent />}
          columnChartChildren={<BarChart />}
          formChildrens={<FormComponent />}
          listCustomerChildren={<ListCusComponent />}
        />
      </RecoilRoot>
    </>
  );
}

export default App;
