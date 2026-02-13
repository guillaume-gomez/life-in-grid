import { RefObject, useEffect, useCallback, useRef, MutableRefObject } from "react";
import "./useResizeTable.css"
// table, fixedColumnClass, storageKeyPrefix
const useResizeTable = (
  tableRef: RefObject<HTMLTableElement>
): void => {

  useEffect(() => {
    if (tableRef.current) {
      const columns = tableRef.current.querySelectorAll("thead th");
      columns.forEach((column, index) => {
        initColumn(column as HTMLElement, index)
      })
    }
  }, [tableRef.current]);


  function createResizer(th: HTMLElement) : HTMLDivElement {
    const resizer = document.createElement("div");
    resizer.className = "column-resizer";
    th.style.position = "relative";
    th.appendChild(resizer);

    return resizer;
  }

  function initColumn(th: HTMLElement, columnPosition: number)  {
    const resizer = createResizer(th);
    resizer.addEventListener("mousedown", (e : any) => onMouseDown(e, th, columnPosition));
  }

  function setCellWidth(element: HTMLElement, width: number) {
    element.style.width = width + "px";
    element.style.maxWidth = width + "px";
    element.style.minWidth = width + "px";
  }

  function onMouseDown(e : React.MouseEvent<HTMLElement>, th: HTMLElement, columnPosition: number) {
    const startMove = e.clientX;
    const originalColumnSize = th.offsetWidth;
    
    function onMouseMove(e : any) {
      const newWidth = Math.max(50, originalColumnSize + (e.clientX - startMove));
      console.log("mouseMouse ", newWidth)
      updateTheWholeColumn(th, newWidth, columnPosition);
    };

    function onMouseUp() {
      columnPosition = - 1;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };


    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup",  onMouseUp);
  }

  function updateTheWholeColumn(th: HTMLElement, width: number, columnPosition: number) {
    if(!tableRef.current) {
      return;
    }
    setCellWidth(th, width);

    const tableRows = tableRef.current.querySelectorAll("tbody tr");
    tableRows.forEach(row => {
      const cell = row.children[columnPosition];
      if (!cell) return;

      setCellWidth(cell as HTMLElement, width);
    });
  }

};

export default useResizeTable;