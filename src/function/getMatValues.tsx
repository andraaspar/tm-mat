import { IMat } from '../model/IMat'

export function getMatValues(mat: IMat) {
	return [
		mat.tr,
		mat.amount.mc,
		mat.amount.iron,
		mat.amount.titanium,
		mat.amount.plant,
		mat.amount.energy,
		mat.amount.heat,
		mat.income.mc,
		mat.income.iron,
		mat.income.titanium,
		mat.income.plant,
		mat.income.energy,
		mat.income.heat,
	]
}
