import React, { useState } from "react";

export default function MonsterTypeForm({ addChallengeRating = (challengeRating: string) => {}}) {
   const [text, setText] = useState<string>("");
   const [count, setCount] = useState<number>(0);

   function handleTextChange(event : React.ChangeEvent<HTMLInputElement>) {
      setText(event.target.value);
   }

   function handleSubmit(event : React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (text) {
        addChallengeRating(text);
        setText("");
      }
    }

    return (
      <form className="ChallengeRatingForm" onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="Filter by challenge rating"
          placeholder="Filter by challenge rating"
          value={text}
          onChange={handleTextChange}
        />
        <input type="submit" value="Add" />
      </form>
    );
}