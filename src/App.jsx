import { useState, useEffect } from "react";
import "./App.css";
import AddRow from "./components/AddRow";
import TableNew from "./components/TableNew";
import { uid } from 'uid';
import { Input, Button } from 'antd';

function App() {
  const [tasks, setTasks] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [value, setValue] = useState('');
  const [clearFilter, setClearFilter] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      const resp = await fetch("https://0f97a70e-598d-4edc-863b-932212a6be58.mock.pstmn.io/tasks");
      let data = await resp.json();
      data = data.tasks.map((row, i) => {
        return { ...row, key: uid() }
      })
      setTasks(data);
    }
    getTasks();
  }, [clearFilter])

  useEffect(() => {
    const set = new Set();
    tasks.forEach((row, i) => {
      row.tag.forEach((val, indx) => set.add(val));
    })
    let tags = Array.from(set);
    tags = tags.map((val, i) => ({ "text": val, "value": val }))
    setTagsFilter(tags);

  }, [tasks]);

  const addRow = (row) => { setTasks([row, ...tasks]) };

  return (
    <div className="app">
      <AddRow addRow={addRow} />
      <Input
        placeholder="Search"
        className="searchInput"
        value={value}
        onChange={e => {
          const currValue = e.target.value.toLowerCase();
          setValue(currValue);
          const filteredData = tasks.filter(entry =>
            entry.title.toLowerCase().includes(currValue) ||
            entry.description.toLowerCase().includes(currValue) ||
            entry.timestamp.toLowerCase().includes(currValue) ||
            entry.dueDate.toLowerCase().includes(currValue) ||
            entry.status.toLowerCase().includes(currValue)
          );
          setTasks(filteredData);
        }}
      />
      <Button onClick={() => {
        setClearFilter(!clearFilter)
        setValue("")
      }}>
        Clear Filter
      </Button>
      <TableNew tasks_data={tasks} setTasks={setTasks} tagsFilter={tagsFilter} />
    </div>
  )
}

export default App;