import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-4 -mb-px border-b-2 font-medium transition-colors ${
        isActive
          ? 'border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
