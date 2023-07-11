import { EnhancedTable } from "./EnhancedTable";
import { EnhancedModal } from "./EnhancedModal";

export const Gallery = () => (
  <>
    <EnhancedModal notes="notes" images="images" videos="videos" defaultratio="" />
    <EnhancedTable notes="notes" images="images" videos="videos" defaultratio="" />
  </>
);