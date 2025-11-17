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


// import { useState, useEffect, useRef } from 'react';
// import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
// import { FaCheck } from 'react-icons/fa';

// export default function MultiSelect() {
//   const [items, setItems] = useState<string[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentInput, setCurrentInput] = useState('');
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);
//   const [isShadow, setIsShadow] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const listRef = useRef<HTMLUListElement>(null); // ref جدید برای لیست

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setIsOpen(false);
//         setIsShadow(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleAddItem = (value: string) => {
//     const newItem = value.trim();
//     if (newItem === '') return;

//     const isDuplicate = items.some((item) => item.toLowerCase() === newItem.toLowerCase()); // case-insensitive check

//     if (!isDuplicate) {
//       setItems((prev) => [...prev, newItem]);
//       setSelectedItems((prev) => [...prev, newItem]); // auto-select new item
//       setCurrentInput(''); // پاک کردن input فقط اگر اضافه شد
//     } else {
//       // پیدا کردن آیتم اصلی (case-insensitive)
//       const duplicateItem = items.find((item) => item.toLowerCase() === newItem.toLowerCase());
//       if (duplicateItem) {
//         toggleSelectItem(duplicateItem);
//         // اسکرول به آیتم تکراری
//         if (listRef.current && isOpen) {
//           const itemElements = listRef.current.querySelectorAll('li');
//           itemElements.forEach((el) => {
//             if (el.textContent?.toLowerCase().includes(duplicateItem.toLowerCase())) {
//               el.scrollIntoView({ behavior: 'smooth', block: 'center' }); // اسکرول نرم به مرکز
//             }
//           });
//         }
//       }
//       console.log('آیتم تکراری است!'); // می‌تونید toast اضافه کنید
//     }
//   };

//   const toggleSelectItem = (item: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
//     );
//     setIsShadow(false);
//   };

//   const removeSelectedItem = (item: string) => {
//     setSelectedItems((prev) => prev.filter((i) => i !== item));
//   };

//   // فیلتر و مرتب‌سازی آیتم‌ها: آیتم‌های matching رو اول بیار (برای دید بهتر duplicates)
//   const filteredItems = items
//     .filter((item) => item.toLowerCase().includes(currentInput.toLowerCase()))
//     .sort((a, b) => {
//       const aMatch = a.toLowerCase() === currentInput.toLowerCase() ? -1 : 0;
//       const bMatch = b.toLowerCase() === currentInput.toLowerCase() ? -1 : 0;
//       return aMatch - bMatch;
//     });

//   return (
//     <div ref={wrapperRef} className="multi-select">
//       <div
//         onClick={() => setIsShadow(true)}
//         className={`multi-select__inputBox ${isShadow ? 'active' : ''}`}
//       >
//         {/* نمایش تگ‌های انتخاب‌شده */}
//         <div className="multi-select__selected-tags">
//           {selectedItems.map((item) => (
//             <span key={item} className="multi-select__tag">
//               {item}
//               <button onClick={() => removeSelectedItem(item)}>×</button>
//             </span>
//           ))}
//         </div>
//         <input
//           type="text"
//           className="multi-select__input"
//           onChange={(e) => setCurrentInput(e.target.value)}
//           value={currentInput}
//           onFocus={() => setIsOpen(true)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               handleAddItem(currentInput);
//             }
//           }}
//         />
//         <button
//           className="multi-select__toggle"
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           {isOpen ? <IoIosArrowUp size={21} color="#5a5555ff" /> : <IoIosArrowDown size={21} color="#5a5555ff" />}
//         </button>
//       </div>
//       {isOpen && (
//         <ul ref={listRef} className="multi-select__list">
//           {filteredItems.length === 0 ? (
//             <li className="multi-select__empty">هیچ آیتمی یافت نشد</li>
//           ) : (
//             filteredItems.map((item, index) => {
//               const isSelected = selectedItems.includes(item);
//               const isDuplicate = currentInput.trim() !== '' && item.toLowerCase() === currentInput.trim().toLowerCase();

//               return (
//                 <li
//                   onClick={() => toggleSelectItem(item)}
//                   className={`multi-select__item
//                     ${isSelected ? 'multi-select__item--selected' : ''}
//                     ${isDuplicate ? 'multi-select__item--duplicate' : ''}`}
//                   key={index}
//                 >
//                   <span>{item}</span>
//                   {isSelected && <FaCheck />}
//                   {isDuplicate && <span className="duplicate-label"> (تکراری)</span>}
//                 </li>
//               );
//             })
//           )}
//         </ul>
//       )}
//     </div>
//   );
// }
