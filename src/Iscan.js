import { EnhancedTable } from "./gallery/EnhancedTable";
import { EnhancedModal } from "./gallery/EnhancedModal";

export const Iscan = () => (
  <>
    <EnhancedModal notes="papiers" images="scans" videos="secret" defaultratio="1.414" />
    <EnhancedTable notes="papiers" images="scans" videos="secret" defaultratio="1.414" />
  </>
);