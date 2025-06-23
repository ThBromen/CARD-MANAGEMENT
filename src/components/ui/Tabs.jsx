import React, { useState } from 'react';

const Tabs = ({ tabs = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${
              idx === activeIndex ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
};

export default Tabs;
