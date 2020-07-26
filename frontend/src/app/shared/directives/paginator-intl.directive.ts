import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { translations } from 'src/app/app.component';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { startWith } from 'rxjs/operators';

@Directive({
  selector: '[appPaginatorIntl]'
})
export class PaginatorIntlDirective implements OnInit {
  @Input('appPaginatorIntl') paginator: MatPaginator;

  constructor(
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.translateService.onLangChange.pipe(
      startWith(null)
    ).subscribe(() => {
      this.paginator._intl.itemsPerPageLabel = translations.AMOUNT_FOR_PAGE;
      this.paginator._intl.firstPageLabel = translations.FIRST_PAGE;
      this.paginator._intl.lastPageLabel = translations.LAST_PAGE;
      this.paginator._intl.nextPageLabel = translations.NEXT_PAGE;
      this.paginator._intl.previousPageLabel = translations.PREVIOUS_PAGE;
      this.paginator._intl.getRangeLabel = this.rangeLabel;
    })
  }

  private rangeLabel(page: number, pageSize: number, length: number) {
    if (length === 0 || pageSize === 0) { return `0 ${translations.FROM_AMOUNT} ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${translations.FROM_AMOUNT} ${length}`;
  }

}
