import { MatPaginatorIntl } from '@angular/material/paginator';
import { translations } from './app.component';

const rangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 ${translations.FROM_AMOUNT} ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} ${translations.FROM_AMOUNT} ${length}`;
}


export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  
  paginatorIntl.itemsPerPageLabel = translations.AMOUNT_FOR_PAGE;
  paginatorIntl.firstPageLabel = translations.FIRST_PAGE;
  paginatorIntl.lastPageLabel = translations.LAST_PAGE;
  paginatorIntl.nextPageLabel = translations.NEXT_PAGE;
  paginatorIntl.previousPageLabel = translations.PREVIOUS_PAGE;
  paginatorIntl.getRangeLabel = rangeLabel;
  
  return paginatorIntl;
}