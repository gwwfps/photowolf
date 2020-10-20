import React, { useState } from 'react';

import Button from './Button';
import ControlsContainer from './ControlsContainer';

export default () => {
  const [opened, setOpened] = useState(false);
  return (
    <ControlsContainer>
      <Button className="opacity-75">Controls</Button>
    </ControlsContainer>
  );
};
