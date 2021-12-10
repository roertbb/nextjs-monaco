import * as React from "react";

function Input({ onChange, correctValue, onSuccess, template }) {
  console.log({ onChange, correctValue, onSuccess });

  const [value, setValue] = React.useState();

  React.useEffect(() => {
    if (correctValue()) {
      onSuccess();
    }
  }, [value]);

  return (
    <div
      style={{
        background: "rgb(39, 40, 34)",
        paddingLeft: "32px",
        marginTop: "-5px",
        marginBottom: "-5px",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => {
          const v = event.target.value;
          setValue(v);
          onChange(template(v));
        }}
      />
    </div>
  );
}

export default Input;
