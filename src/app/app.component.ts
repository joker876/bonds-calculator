import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

export interface BondItem {
  name: string;
  rate: number;
  period: number;
  buyoutCost: number;
  capitalizationPeriod: CapitalizationPeriod;
}

export const CapitalizationPeriod = {
  Monthly: 'monthly',
  Yearly: 'yearly',
} as const;
export type CapitalizationPeriod = (typeof CapitalizationPeriod)[keyof typeof CapitalizationPeriod];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DecimalPipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly initialData: BondItem[] = [
    {
      name: 'ROR',
      rate: 0.0575,
      period: 1,
      buyoutCost: 0.5,
      capitalizationPeriod: CapitalizationPeriod.Monthly,
    },
    {
      name: 'DOR',
      rate: 0.059,
      period: 2,
      buyoutCost: 0.7,
      capitalizationPeriod: CapitalizationPeriod.Monthly,
    },
    {
      name: 'TOS',
      rate: 0.0595,
      period: 3,
      buyoutCost: 1,
      capitalizationPeriod: CapitalizationPeriod.Yearly,
    },
    {
      name: 'COI',
      rate: 0.063,
      period: 4,
      buyoutCost: 2,
      capitalizationPeriod: CapitalizationPeriod.Yearly,
    },
    {
      name: 'EDO',
      rate: 0.0655,
      period: 10,
      buyoutCost: 3,
      capitalizationPeriod: CapitalizationPeriod.Yearly,
    },
    {
      name: 'ROS',
      rate: 0.065,
      period: 6,
      buyoutCost: 2,
      capitalizationPeriod: CapitalizationPeriod.Yearly,
    },
    {
      name: 'ROS',
      rate: 0.068,
      period: 12,
      buyoutCost: 3,
      capitalizationPeriod: CapitalizationPeriod.Yearly,
    },
  ];

  readonly mappedData = computed(() => {
    return this.initialData.map(item => {
      return {
        ...item,
        firstPayout: this._getFirstPayout(item),
        year1: this._calculateReturnAfter(item, 1, false),
        year1Buyout: this._calculateReturnAfter(item, 1, true),
        year2: this._calculateReturnAfter(item, 2, false),
        year2Buyout: this._calculateReturnAfter(item, 2, true),
        year3: this._calculateReturnAfter(item, 3, false),
        year3Buyout: this._calculateReturnAfter(item, 3, true),
        year4: this._calculateReturnAfter(item, 4, false),
        year4Buyout: this._calculateReturnAfter(item, 4, true),
        year5: this._calculateReturnAfter(item, 5, false),
        year5Buyout: this._calculateReturnAfter(item, 5, true),
        year6: this._calculateReturnAfter(item, 6, false),
        year6Buyout: this._calculateReturnAfter(item, 6, true),
        year7: this._calculateReturnAfter(item, 7, false),
        year7Buyout: this._calculateReturnAfter(item, 7, true),
        year8: this._calculateReturnAfter(item, 8, false),
        year8Buyout: this._calculateReturnAfter(item, 8, true),
        year9: this._calculateReturnAfter(item, 9, false),
        year9Buyout: this._calculateReturnAfter(item, 9, true),
        year10: this._calculateReturnAfter(item, 10, false),
        year10Buyout: this._calculateReturnAfter(item, 10, true),
        year11: this._calculateReturnAfter(item, 11, false),
        year11Buyout: this._calculateReturnAfter(item, 11, true),
        year12: this._calculateReturnAfter(item, 12, false),
        year12Buyout: this._calculateReturnAfter(item, 12, true),
      }
    })
  })

  readonly startCash = signal<number>(10000);
  readonly startBonds = signal<number>(100);

  onStartCashBlur() {
    this.startCash.update(v => Math.floor(v / 100) * 100);
    this.startBonds.set(this.startCash() / 100);
  }
  onStartBondsBlur() {
    this.startCash.set(this.startBonds() * 100);
  }

  monthlyFilterFn(item: BondItem): boolean {
    return item.capitalizationPeriod === CapitalizationPeriod.Monthly;
  }
  private _getRate(item: BondItem): number {
    return item.capitalizationPeriod === CapitalizationPeriod.Yearly ? item.rate : item.rate / 12;
  }
  private _getFirstPayout(item: BondItem): number {
    return this._getRate(item) * this.startCash();
  }
  private _calculateReturnAfter(item: BondItem, years: number, buyout: boolean): number {
    const rate = this._getRate(item);
    const subdivisions = item.capitalizationPeriod === CapitalizationPeriod.Yearly ? years : years * 12;

    let cash = 0;
    let bonds = this.startBonds();
    for (let i = 0; i < subdivisions; i++) {
      bonds += Math.floor(cash / 100);
      cash %= 100;
      cash += bonds * rate * 100;
    }
    return (
      cash +
      (bonds - this.startBonds()) * 100 -
      (buyout && years % item.period !== 0 ? item.buyoutCost * bonds : 0)
    );
  }
}
