import {useState, useEffect} from 'react';
import MonsterTypeForm from './MonsterType/MonsterTypeForm';
import MonsterType from './MonsterType/MonsterType';
import ChallengeRatingForm from './ChallengeRating/ChallengeRatingForm';
import ChallengeRating from './ChallengeRating/ChallengeRating';
import MonsterInfo from './MonsterInfo';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

type MyMap = Record<string, Array<MonsterInfo>>;


const App: React.FC = () => {

  const [monsterTypes, setMonsterTypes] = useState<Array<string>>([]);
  const [challengeRatings, setChallengeRatings] = useState<Array<string>>([]);
  const [displayMap, setDisplayMap] = useState<MyMap>({});
  const [totalCount, setTotalCount] = useState<number>(0);
 
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<MonsterInfo | null>(null);

  const openModal = (info : MonsterInfo) => {
    setModalDetails(info);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalDetails(null);
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (modalIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to reset the overflow style when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalIsOpen]);

  const addDataToMap = (key : string, value : MonsterInfo) => {
    setDisplayMap((prevMap) => {
      const updatedMap = prevMap[key] ? [...prevMap[key], value] : [value];
      return {
        ...prevMap,
        [key]: updatedMap
      };
    });
  }

  const addMonsterType = (monsterType: string) => {
    if(!monsterTypes.includes(monsterType)) {
      setMonsterTypes((monsterTypes) => [monsterType, ...monsterTypes]);
    }
  };

  const removeMonsterType = (monsterTypeIdToRemove : string) => {
    setMonsterTypes((monsterTypes) =>
        monsterTypes.filter((monsterType) => monsterType !== monsterTypeIdToRemove)
    );
  };

  const addChallengeRating = (challengeRating: string) => {
    if(!challengeRatings.includes(challengeRating)) {
      setChallengeRatings((challengeRatings) => [challengeRating, ...challengeRatings]);
    }
  };

  const removeChallengeRating = (challengeRatingToRemove : string) => {
    setChallengeRatings((challengeRatings) =>
      challengeRatings.filter((challengeRating) => challengeRating !== challengeRatingToRemove)
    );
  };

  const handleClick = () => {

    setDisplayMap({});
    setTotalCount(0);

    var url : string = "http://localhost:8080/api/monsters?";

    var urlChallengeRatings : string = "";
    var urlMonsterTypes : string = "";

    challengeRatings.forEach((challengeRating) => {
      urlChallengeRatings += challengeRating + ",";
    })
    if(urlChallengeRatings.length !== 0) {
      urlChallengeRatings = "challenge_rating=" + urlChallengeRatings.substring(0, urlChallengeRatings.length - 1);
    }

    monsterTypes.forEach((monsterType) => {
      urlMonsterTypes += monsterType + ",";
    })
    if(urlMonsterTypes.length !== 0) {
      urlMonsterTypes = "type=" + urlMonsterTypes.substring(0, urlMonsterTypes.length - 1);
    }

    if(urlChallengeRatings.length !== 0 && urlMonsterTypes.length !== 0) {
      url += urlChallengeRatings + "&" + urlMonsterTypes;
    } else if (urlChallengeRatings.length !== 0) {
      url += urlChallengeRatings;
    } else if (urlMonsterTypes.length !== 0) {
      url += urlMonsterTypes;
    } else {
      url = url.substring(0, url.length - 1);
    }

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders
    };

    fetch(url, requestOptions)
      .then((response) => { return (response.json()) })
      .then((data : MonsterInfo[]) => {
        data.forEach((monster : MonsterInfo) => {
          const keyToUse = monster.type.toLowerCase() + "_" + monster.challenge_rating; 
          addDataToMap(keyToUse, monster);
          setTotalCount((totalCount) => totalCount + 1);
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="flex-container">
        <div className="MonsterTypeFormDiv">
          <MonsterTypeForm addMonsterType={addMonsterType}/>
          <ul className="monsterTypes" key="monsterTypeList">
            {monsterTypes.map((monsterType) => (
              <MonsterType
                key={"key_" + monsterType}
                monsterType={monsterType}
                removeMonsterType={removeMonsterType}/>
            ))}
          </ul>
        </div>
        <div className="ChallengeRatingFormDiv">
          <ChallengeRatingForm addChallengeRating={addChallengeRating}/>
          <ul className="challengeRatings" key="challengeRatingsList">
            {challengeRatings.map((challengeRating) => (
              <ChallengeRating
                key={"key_" + challengeRating}
                challengeRating={challengeRating}
                removeChallengeRating={removeChallengeRating}/>
            ))}
          </ul>
        </div>
      </div>
      <div key="Calculation button">
        <button onClick={handleClick}>Pull all monsters with selected details</button>
      </div>
      <div><p>{"Total monsters found: " + totalCount}</p></div>
      <div className="List_of_returned_data" key="List of returned data">
        {Object.entries(displayMap).map(([key, monsters]) => (
            <div className="monsterSection" key={key}>
              <h3>{"Type: " + key.split('_')[0] + ",      CR: " + key.split('_')[1]}</h3>
              { monsters.map((monster) => (
                  <button className="monsterDetailButton" onClick={() => openModal(monster)}>
                    {monster.name}
                  </button>
              ))}
            </div>
        ))}
      </div>
      <div>
        <Modal 
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Monster Info"
          className="modal"
          overlayClassName="overlay">
            <h4>{modalDetails?.name}</h4>
            <p>Type: {modalDetails?.type}</p>
            <p>CR: {modalDetails?.challenge_rating}</p>
            <p>Size: {modalDetails?.size}</p>
            <p>Hit Points: {modalDetails?.hit_points}</p>
            <p>Armor Class: {modalDetails?.armor_class}</p>
            <p>Strength: {modalDetails?.strength}</p>
            <p>Dexterity: {modalDetails?.dexterity}</p>
            <p>Constitution: {modalDetails?.constitution}</p>
            <p>Intelligence: {modalDetails?.intelligence}</p>
            <p>Wisdom: {modalDetails?.wisdom}</p>
            <p>Charisma: {modalDetails?.charisma}</p>
            <p>Reference Book: {modalDetails?.ref_title}</p>
            <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </>
  );
}

export default App;