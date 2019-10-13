import { IMutableValue } from './IMutableValue'

export interface IFacets<T = IMutableValue> {
	readonly mc: T
	readonly iron: T
	readonly titanium: T
	readonly plant: T
	readonly energy: T
	readonly heat: T
}
