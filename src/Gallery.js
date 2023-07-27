import { useState } from 'react';
import { EnhancedTable } from "./EnhancedTable";
import { EnhancedModal } from "./EnhancedModal";
import Navbarr from './Navbarr';


export const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTopTags, setShowTopTags] = useState(false);

  return (
    <>
      <Navbarr setShowTopTags={setShowTopTags} showModal={showModal} setShowModal={setShowModal} />
      <EnhancedModal notes="notes" images="images" videos="videos" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
      <EnhancedTable notes="notes" images="images" videos="videos" defaultratio="" showModal={showModal} setShowModal={setShowModal} showTopTags={showTopTags} setShowTopTags={setShowTopTags}  />
    </>
  );
};
