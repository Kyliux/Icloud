import { useState } from 'react';
import { EnhancedTable } from "./EnhancedTable";
import { EnhancedModal } from "./EnhancedModal";
import Navbarx from '../navbar/Navbarx';


export const Gallery = (props ) => {
  const [showModal, setShowModal] = useState(false);
  const [showTopTags, setShowTopTags] = useState(false);

  return (
    <>
      <Navbarx navitems={props.navitems} setShowTopTags={setShowTopTags} showModal={showModal} setShowModal={setShowModal} />
      <EnhancedModal notes="note" images="image" videos="videos" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
<div className="py-8" style={{ marginTop: '10px' }}>
  <EnhancedTable notes="note" images="image" videos="videos" defaultratio="" showModal={showModal} setShowModal={setShowModal} showTopTags={showTopTags} setShowTopTags={setShowTopTags} />
</div> </>
  );
};
