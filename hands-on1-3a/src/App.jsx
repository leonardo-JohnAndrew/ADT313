import logo from './logo.svg';
import './App.css';
import Name from './component/Name/Name';
import Section from './component/Section/Section';
import Description from './component/Description/Description';

function App() {
  const userInfo = {
    Fname :' John Andrew',
    Lname : 'Leonardo',
    Section:'BSIT 3A', 
    Description: 'Lazy Person',
    }
  return (
    <div className="App">
    <Name Fname = {userInfo.Fname}Lname ={userInfo.Lname}
    />
    <Section Section ={userInfo.Section} />
    <Description Descript = {userInfo.Description} />
    </div>
  );
}

export default App;
