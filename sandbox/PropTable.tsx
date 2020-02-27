import * as React from "react";

type Prop = {
  name: string;
  type: string;
  description: string;
};

type PropTableProps = {
  props: Array<Prop>;
};

export default function PropTable({ props }: PropTableProps) {
  return (
    <table className="propTable">
      <tbody>
        {props.map((prop, i) => {
          return (
            <tr key={i}>
              <td className="propTableName">{prop.name}</td>
              <td>
                <div>
                  <pre className="propTableCode">
                    <code>{prop.type}</code>
                  </pre>
                </div>
                <div>{prop.description}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
