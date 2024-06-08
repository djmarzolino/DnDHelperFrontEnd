import React, { useState } from "react";

export default function MonsterTypeForm({ addMonsterType = (monsterType: string) => {}}) {
   const [text, setText] = useState<string>("");

   function handleTextChange(event : React.ChangeEvent<HTMLInputElement>) {
      setText(event.target.value);
   }

   function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (text) {
        addMonsterType(text);
        setText("");
      }
    }

    return (
      <form className="MonsterTypeForm" onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="Filter by monster type"
          placeholder="Filter by monster type"
          value={text}
          onChange={handleTextChange}
        />
        <input type="submit" value="Add" />
      </form>
    );
}