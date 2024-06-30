import { NgModule } from '@angular/core';
import { PipeDateFormat } from './date.pipe';
import { PipeDatetimeFormat } from './datetime.pipe';
import { PipeFileSizeFormat } from './fileSize.pipe';
import { PipeDecimalMoneyFormat } from './decimalMoney.pipe';

@NgModule({
  declarations: [PipeDateFormat, PipeDatetimeFormat, PipeFileSizeFormat, PipeDecimalMoneyFormat],
  exports: [PipeDateFormat, PipeDatetimeFormat, PipeFileSizeFormat, PipeDecimalMoneyFormat],
})
export class PipeModule {}
