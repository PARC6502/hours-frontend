import React from "react";
import { Button } from "semantic-ui-react";

const VendorSelector = props => {
  function onClick(event, data) {
    props.onChange(event, data);
  }
  return (
    <Button.Group>
      <Button
        name="vendor"
        value={false}
        toggle
        active={!props.value}
        onClick={onClick}
      >
        User
      </Button>
      <Button.Or />
      <Button
        name="vendor"
        value={true}
        toggle
        active={props.value}
        onClick={onClick}
      >
        Vendor
      </Button>
    </Button.Group>
  );
};

export default VendorSelector;
