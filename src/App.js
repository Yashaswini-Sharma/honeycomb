import React, { useState } from 'react';
import HoneycombPlot from './honeycombPlot';

const App = () => {
  const [easyCount, setEasyCount] = useState(8);
  const [mediumCount, setMediumCount] = useState(6);
  const [hardCount, setHardCount] = useState(1);

  return (
    <div>
      <h1>Honeycomb Plot Example</h1>
      <HoneycombPlot easyCount={26} mediumCount={12} hardCount={13} width={800} height={600} />

    </div>
  );
};

export default App;
