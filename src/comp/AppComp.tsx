import { Draft, produce } from 'immer'
import * as React from 'react'
import { useState } from 'react'
import { formatChange } from '../function/formatChange'
import { getMatValues } from '../function/getMatValues'
import { matToChange } from '../function/matToChange'
import { IChange } from '../model/IChange'
import { IMat } from '../model/IMat'
import { IMutableValue } from '../model/IMutableValue'
import { ReactComponent as EnergySvg } from '../resource/energy.svg'
import { ReactComponent as GenerationSvg } from '../resource/generation.svg'
import { ReactComponent as HeatSvg } from '../resource/heat.svg'
import { ReactComponent as IronSvg } from '../resource/iron.svg'
import { ReactComponent as McSvg } from '../resource/mc.svg'
import { ReactComponent as PlantSvg } from '../resource/plant.svg'
import { ReactComponent as TitaniumSvg } from '../resource/titanium.svg'
import { ReactComponent as TrSvg } from '../resource/tr.svg'
import style from './AppComp.module.css'
import { MutableValueComp } from './MutableValueComp'

export interface AppCompProps {}

const defaultMat: IMat = {
	generation: 1,
	tr: { current: 20, change: 0, isValid: true },
	amount: {
		mc: { current: 42, change: 0, isValid: true },
		iron: { current: 0, change: 0, isValid: true },
		titanium: { current: 0, change: 0, isValid: true },
		plant: { current: 0, change: 0, isValid: true },
		energy: { current: 0, change: 0, isValid: true },
		heat: { current: 0, change: 0, isValid: true },
	},
	income: {
		mc: { current: 1, change: 0, isValid: true },
		iron: { current: 1, change: 0, isValid: true },
		titanium: { current: 1, change: 0, isValid: true },
		plant: { current: 1, change: 0, isValid: true },
		energy: { current: 1, change: 0, isValid: true },
		heat: { current: 1, change: 0, isValid: true },
	},
}

export function AppComp(props: AppCompProps) {
	const [$historyPage, set$historyPage] = useState(0)
	const [$history, set$history] = useState<readonly IChange[]>(
		() => loadHistory() || [],
	)
	const [$mat, set$mat] = useState<IMat>(() => historyToMat($history))
	const lastPage = Math.max(0, Math.ceil($history.length / 10) - 1)
	function persistHistory(history: readonly IChange[]) {
		localStorage.setItem('history', JSON.stringify(history))
	}
	function loadHistory(): readonly IChange[] | null {
		return JSON.parse(localStorage.getItem('history') || 'null')
	}
	function makeHistory(oldMat: IMat, newMat: IMat) {
		const change = matToChange(oldMat, newMat)
		set$historyPage(0)
		const newHistory = [change, ...$history]
		set$history(newHistory)
		persistHistory(newHistory)
		set$mat(newMat)
	}
	function nextGeneration() {
		const newMat = produce($mat, mat => {
			mat.generation++

			mat.amount.heat.current += mat.amount.energy.current
			mat.amount.energy.current = 0

			mat.amount.mc.current += mat.tr.current + mat.income.mc.current
			mat.amount.iron.current += mat.income.iron.current
			mat.amount.titanium.current += mat.income.titanium.current
			mat.amount.plant.current += mat.income.plant.current
			mat.amount.energy.current += mat.income.energy.current
			mat.amount.heat.current += mat.income.heat.current
		})
		set$mat(newMat)
		makeHistory($mat, newMat)
	}
	function applyChanges() {
		const newMat = produce($mat, mat => {
			for (const value of getMatValues(mat) as Draft<IMutableValue>[]) {
				value.current += value.change
				value.change = 0
			}
		})
		makeHistory($mat, newMat)
	}
	function cancelChanges() {
		const newMat = produce($mat, mat => {
			for (const value of getMatValues(mat) as Draft<IMutableValue>[]) {
				value.change = 0
			}
		})
		set$mat(newMat)
	}
	function historyToMat(history: readonly IChange[]): IMat {
		return produce(defaultMat, mat => {
			for (const change of history) {
				mat.generation += change.generation

				mat.tr.current += change.tr

				mat.amount.mc.current += change.amount.mc
				mat.amount.iron.current += change.amount.iron
				mat.amount.titanium.current += change.amount.titanium
				mat.amount.plant.current += change.amount.plant
				mat.amount.energy.current += change.amount.energy
				mat.amount.heat.current += change.amount.heat

				mat.income.mc.current += change.income.mc
				mat.income.iron.current += change.income.iron
				mat.income.titanium.current += change.income.titanium
				mat.income.plant.current += change.income.plant
				mat.income.energy.current += change.income.energy
				mat.income.heat.current += change.income.heat
			}
		})
	}
	function isValid() {
		return !getMatValues($mat).find(_ => !_.isValid)
	}
	function hasChange() {
		return !!getMatValues($mat).find(_ => _.change)
	}
	return (
		<>
			<p>
				<button
					type='button'
					onClick={() => {
						if (window.confirm('Biztos új játékot kezdesz?')) {
							set$historyPage(0)
							const newHistory: readonly IChange[] = []
							set$history(newHistory)
							persistHistory(newHistory)
							set$mat(historyToMat(newHistory))
						}
					}}
					disabled={$history.length === 0}
				>
					Új játék
				</button>
			</p>
			<p>
				<GenerationSvg width={16} height={16} /> {$mat.generation}.
				generáció
			</p>
			<table className={style.table}>
				<thead>
					<tr>
						<th></th>
						<th>Erőforrás</th>
						<th>Bevétel</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<TrSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.tr}
								_setValue={tr => {
									set$mat({ ...$mat, tr })
								}}
								_min={20}
								_max={100}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<McSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.mc}
								_setValue={mc => {
									set$mat(
										produce($mat, mat => {
											mat.amount.mc = mc as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.mc}
								_setValue={mc => {
									set$mat(
										produce($mat, mat => {
											mat.income.mc = mc as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={-5}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
					<tr>
						<td>
							<IronSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.iron}
								_setValue={iron => {
									set$mat(
										produce($mat, mat => {
											mat.amount.iron = iron as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.iron}
								_setValue={iron => {
									set$mat(
										produce($mat, mat => {
											mat.income.iron = iron as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
					<tr>
						<td>
							<TitaniumSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.titanium}
								_setValue={titanium => {
									set$mat(
										produce($mat, mat => {
											mat.amount.titanium = titanium as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.titanium}
								_setValue={titanium => {
									set$mat(
										produce($mat, mat => {
											mat.income.titanium = titanium as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
					<tr>
						<td>
							<PlantSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.plant}
								_setValue={plant => {
									set$mat(
										produce($mat, mat => {
											mat.amount.plant = plant as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
							<div className={style.extraButton}>
								<button
									type='button'
									onClick={() => {
										const newMat = produce($mat, mat => {
											mat.amount.plant.current -= 8
										})
										makeHistory($mat, newMat)
									}}
									disabled={$mat.amount.plant.current < 8}
								>
									Növényzetlapkát veszek
								</button>
							</div>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.plant}
								_setValue={plant => {
									set$mat(
										produce($mat, mat => {
											mat.income.plant = plant as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
					<tr>
						<td>
							<EnergySvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.energy}
								_setValue={energy => {
									set$mat(
										produce($mat, mat => {
											mat.amount.energy = energy as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.energy}
								_setValue={energy => {
									set$mat(
										produce($mat, mat => {
											mat.income.energy = energy as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
					<tr>
						<td>
							<HeatSvg />
						</td>
						<td>
							<MutableValueComp
								_value={$mat.amount.heat}
								_setValue={heat => {
									set$mat(
										produce($mat, mat => {
											mat.amount.heat = heat as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_canChangeALot
							/>
							<div className={style.extraButton}>
								<button
									type='button'
									onClick={() => {
										const newMat = produce($mat, mat => {
											mat.amount.heat.current -= 8
										})
										makeHistory($mat, newMat)
									}}
									disabled={$mat.amount.heat.current < 8}
								>
									Emelem a hőmérsékletet
								</button>
							</div>
						</td>
						<td>
							<MutableValueComp
								_value={$mat.income.heat}
								_setValue={heat => {
									set$mat(
										produce($mat, mat => {
											mat.income.heat = heat as Draft<
												IMutableValue
											>
										}),
									)
								}}
								_min={0}
								_max={Infinity}
								_isIncome
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<p>
				<button
					type='button'
					onClick={() => {
						applyChanges()
					}}
					disabled={!isValid() || !hasChange()}
				>
					OK
				</button>
				{'          '}
				<button
					type='button'
					onClick={() => {
						cancelChanges()
					}}
					disabled={!hasChange()}
				>
					Mégse
				</button>{' '}
				<button
					type='button'
					onClick={() => {
						nextGeneration()
					}}
					disabled={hasChange()}
				>
					Generáció váltás
				</button>
			</p>
			{$history
				.slice($historyPage * 10, $historyPage * 10 + 10)
				.map((change, index) => (
					<p key={index}>
						{change.generation !== 0 && (
							<>
								<GenerationSvg width={16} height={16} />{' '}
								{change.generation}{' '}
							</>
						)}
						{change.tr !== 0 && (
							<>
								<TrSvg width={16} height={16} /> {change.tr}{' '}
							</>
						)}
						{/* prettier-ignore */ change.amount.mc !== 0 && <><McSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.mc)}</span>{' '}</>}
						{/* prettier-ignore */ change.amount.iron !== 0 && <><IronSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.iron)}</span>{' '}</>}
						{/* prettier-ignore */ change.amount.titanium !== 0 && <><TitaniumSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.titanium)}</span>{' '}</>}
						{/* prettier-ignore */ change.amount.plant !== 0 && <><PlantSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.plant)}</span>{' '}</>}
						{/* prettier-ignore */ change.amount.energy !== 0 && <><EnergySvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.energy)}</span>{' '}</>}
						{/* prettier-ignore */ change.amount.heat !== 0 && <><HeatSvg width={16} height={16} /> <span className={style.historyValue}>{formatChange(change.amount.heat)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.mc !== 0 && <><McSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.mc)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.iron !== 0 && <><IronSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.iron)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.titanium !== 0 && <><TitaniumSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.titanium)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.plant !== 0 && <><PlantSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.plant)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.energy !== 0 && <><EnergySvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.energy)}</span>{' '}</>}
						{/* prettier-ignore */ change.income.heat !== 0 && <><HeatSvg width={16} height={16} /> <span className={[style.historyValue, style.income].join(' ')}>{formatChange(change.income.heat)}</span>{' '}</>}
					</p>
				))}
			<p>
				<button
					type='button'
					onClick={() => {
						set$historyPage($historyPage - 1)
					}}
					disabled={$historyPage === 0}
				>
					«
				</button>{' '}
				<button
					type='button'
					onClick={() => {
						if (window.confirm('Biztos visszavonod?')) {
							set$historyPage(0)
							const newHistory = $history.slice(1)
							set$history(newHistory)
							persistHistory(newHistory)
							set$mat(historyToMat(newHistory))
						}
					}}
					disabled={$history.length === 0}
				>
					Visszavonom
				</button>{' '}
				<button
					type='button'
					onClick={() => {
						set$historyPage($historyPage + 1)
					}}
					disabled={$historyPage === lastPage}
				>
					»
				</button>
			</p>
		</>
	)
}
