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
        year1: this.calculateReturnAfter(item, 1, false),
        year1Buyout: this.calculateReturnAfter(item, 1, true),
        year2: this.calculateReturnAfter(item, 2, false),
        year2Buyout: this.calculateReturnAfter(item, 2, true),
        year3: this.calculateReturnAfter(item, 3, false),
        year3Buyout: this.calculateReturnAfter(item, 3, true),
        year4: this.calculateReturnAfter(item, 4, false),
        year4Buyout: this.calculateReturnAfter(item, 4, true),
        year6: this.calculateReturnAfter(item, 6, false),
        year6Buyout: this.calculateReturnAfter(item, 6, true),
        year10: this.calculateReturnAfter(item, 10, false),
        year10Buyout: this.calculateReturnAfter(item, 10, true),
        year12: this.calculateReturnAfter(item, 12, false),
        year12Buyout: this.calculateReturnAfter(item, 12, true),
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
  calculateReturnAfter(item: BondItem, years: number, buyout: boolean): number {
    const rate = item.capitalizationPeriod === CapitalizationPeriod.Yearly ? item.rate : item.rate / 12;
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
