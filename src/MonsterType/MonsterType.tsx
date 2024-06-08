type MonsterTypeProps = {
  monsterType: string;
  removeMonsterType: Function;
};

export default function MonsterType( { monsterType, removeMonsterType }: MonsterTypeProps) {

  const handleRemoveClick = () => {
    removeMonsterType(monsterType);
  };

  return (
    <li className="MonsterType" key={"key_" + monsterType}>
      <button
        key={"button_" + monsterType}
        aria-label="Remove monster type"
        className="remove-button"
        onClick={handleRemoveClick}
      >
        &times;
      </button>
      <div key={"div_" + monsterType} className="text">{monsterType}</div>
    </li>
  );
}
