import { useEffect, useRef, useState } from "react";
import './Multiselect.scss'
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

export default function MultiSelect() {
  const [items, setItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [currentInput ,setCurrentInput] = useState("");
   const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isShadow ,setIsShadow]=useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsShadow(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddItem = (value: string) => {
    const newItem = value.trim();
    if ( newItem === "")return 

      const isDuplicate = items.includes(newItem)
      
      
      if(!isDuplicate){
      setItems(prev=>[...prev, newItem]);
      setCurrentInput("")
    }else{
      toast.error("This item has already been defined.")
    }

    const duplicateItem = items.find(item => item.toLowerCase() === newItem.toLowerCase())

    if(listRef.current && duplicateItem){
      const itemElements = listRef.current.querySelectorAll('li')
      itemElements.forEach((el)=>{
        if(el.textContent?.toLowerCase().includes(duplicateItem)){
          el.scrollIntoView({behavior:"smooth",block:"start"})
        }
      })
    }
  };

  const toggleSelectItem = (item:string)=>{
    setSelectedItems(prev =>
      prev.includes(item)? prev.filter(i => i !== item) : [...prev , item]
    )
  }

  return (
    <div ref={wrapperRef} className="multi-select">
     <div
     onClick={()=>setIsShadow(true)}
     className={`multi-select__inputBox ${isShadow ? "active":""}`}>
       <input
        type="text"
        className="multi-select__input"
        onChange={(e)=>{
          setCurrentInput(e.target.value)
        }}
        value={currentInput}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
            handleAddItem(currentInput)
           
            setCurrentInput('')
          }
        }}
      />
      <button
      className="multi-select__toggle"
      onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <ChevronDown size={21} color="#5a5555ff" /> : <ChevronUp size={21} color="#5a5555ff"/>}
      </button>
     </div>
      {isOpen && (
        <ul ref={listRef} className="multi-select__list">
          {items.map((item, index) => {
           const isSelected = selectedItems.includes(item)
           const isDuplicate = currentInput.trim() !== "" &&
            item.toLowerCase() === currentInput.trim().toLowerCase()
           
           return(
             <li
             onClick={()=>{
              toggleSelectItem(item)
              setIsShadow(false)
             }}
            className={`multi-select__item
              ${isSelected ? "multi-select__item--selected":""}
              ${isDuplicate ? "multi-select__item--duplicate":"" }`}
            key={index}>
              <span>{item}</span>
              {isSelected && <Check />}
              </li>
           )
})}
        </ul>
      )}
    </div>
  );
}
