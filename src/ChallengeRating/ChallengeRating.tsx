type ChallengeRatingProps = {
  challengeRating: string;
  removeChallengeRating: Function;
};

export default function ChallengeRating( { challengeRating, removeChallengeRating }: ChallengeRatingProps) {

  const handleRemoveClick = () => {
    removeChallengeRating(challengeRating);
  };

  return (
    <li className="ChallengeRating" key={"key_" + challengeRating}>
      <button
        key={"button_" + challengeRating}
        aria-label="Remove challenge rating"
        className="remove-button"
        onClick={handleRemoveClick}
      >
        &times;
      </button>
      <div key={"div_" + challengeRating} className="text">{challengeRating}</div>
    </li>
  );
}
