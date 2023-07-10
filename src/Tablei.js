const { user } = useContext(AuthContext);
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);
const [activeTags, setActiveTags] = useState([]);
const [excludedTags, setExcludedTags] = useState([]);
const [topTags, setTopTags] = useState([]);

const gridRef = useRef(null);
const packeryRef = useRef(null);
const activeTagsRef = useRef([]);
const excludedTagsRef = useRef([]);

useEffect(() => {
  window.addEventListener("reload", list);

  return () => {
    window.removeEventListener("reload", list);
  };
}, []);

useEffect(() => {
  if ([undefined, null].includes(user)) {
    setItems([]);
    setFilteredItems([]);
    return;
  }

  list();
}, [user]);

useEffect(() => {
  if (gridRef.current) {
    packeryRef.current = new Packery(gridRef.current, {
      itemSelector: ".grid-item",
      percentPosition: true,
      gutter: 10,
    });

    return () => {
      packeryRef.current.destroy();
    };
  }
}, []);

useEffect(() => {
  if (packeryRef.current) {
    packeryRef.current.reloadItems();
    packeryRef.current.layout();
  }
}, [filteredItems]);

useEffect(() => {
  fetchTopTags();
}, [items]);

const list = async () => {
  const { items } = await listDocs({
    collection: "notes",
    filter: {},
  });

  setItems(items);
  setFilteredItems(items);
};