import { IChange } from '../model/IChange'
import { IMat } from '../model/IMat'

export function matToChange(old: IMat, nu: IMat): IChange {
	return {
		generation: nu.generation - old.generation,
		tr: nu.tr.current - old.tr.current,
		amount: {
			mc: nu.amount.mc.current - old.amount.mc.current,
			iron: nu.amount.iron.current - old.amount.iron.current,
			titanium: nu.amount.titanium.current - old.amount.titanium.current,
			plant: nu.amount.plant.current - old.amount.plant.current,
			energy: nu.amount.energy.current - old.amount.energy.current,
			heat: nu.amount.heat.current - old.amount.heat.current,
		},
		income: {
			mc: nu.income.mc.current - old.income.mc.current,
			iron: nu.income.iron.current - old.income.iron.current,
			titanium: nu.income.titanium.current - old.income.titanium.current,
			plant: nu.income.plant.current - old.income.plant.current,
			energy: nu.income.energy.current - old.income.energy.current,
			heat: nu.income.heat.current - old.income.heat.current,
		},
	}
}
