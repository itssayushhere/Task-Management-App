/* eslint-disable react/prop-types */
import { useState } from "react";
import { AutoComplete } from "antd";

const InputMembers = ({ allUsers, selectedMembers, setSelectedMembers }) => {
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState([]);

  const handleAutoComplete = (value) => {
    setInput(value);
  };
  const handleMembers = (value) => {
    const selectedUser = allUsers.find((user) => user.name === value);
    if (!selectedUser) return; 
    const userId = selectedUser._id;
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
      setShowMembers([...showMembers, { name: value, id: userId }]); 
      setInput(""); 
    } else {
      setInput("");
    }
  };

  const handleRemove = (id) => {
    setSelectedMembers(selectedMembers.filter((memberId) => memberId !== id));
    setShowMembers(showMembers.filter((member) => member.id !== id));
  };

  const options = allUsers.map((user) => ({
    value: user.name, // Display name in the dropdown
    label: user.name,
  }));

  return (
    <div className="mb-4">
      {allUsers.length === 0 ? (
        <h1 className="p-2 text-center text-wrap">
          No members left on the server to Add
        </h1>
      ) : (
        <div>
          <div className="mb-2 text-sm font-medium items-center text-gray-700 flex">
            <h1 className="text-black flex ">To:</h1>
            <div className="flex w-72 flex-wrap">
              {showMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex gap-1 m-[2px] bg-slate-200 px-2 py-[2px] w-fit rounded-xl border border-black"
                >
                  <p>{member.name}</p>
                  <button
                    onClick={() => handleRemove(member.id)} // Remove by id
                    className="flex gap-1"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex items-center gap-2">
            <AutoComplete
              options={options}
              placeholder="Type to search"
              filterOption={(inputValue, option) =>
                option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
              onChange={handleAutoComplete}
              onSelect={(value) => handleMembers(value)} // Handle selection from dropdown
              value={input}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InputMembers;
