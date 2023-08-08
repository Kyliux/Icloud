import { useState } from 'react';
import { Book } from "./Book";
import { EnhancedModal } from "../gallery/EnhancedModal";
import Navbarx from '../navbar/Navbarx';


export const Story = (props ) => {
  const [showModal, setShowModal] = useState(false);
  const [showTopTags, setShowTopTags] = useState(false);

  return (
    <>
      <Navbarx navitems={props.navitems} setShowTopTags={setShowTopTags} showModal={showModal} setShowModal={setShowModal} />
      <EnhancedModal notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
<div className="py-8" style={{ marginTop: '10px' }}>
  <Book notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} showTopTags={showTopTags} setShowTopTags={setShowTopTags} />
</div> </>
  );
};
export default Story;
