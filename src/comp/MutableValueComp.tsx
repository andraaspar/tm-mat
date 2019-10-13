import * as React from 'react'
import { formatChange } from '../function/formatChange'
import { IMutableValue } from '../model/IMutableValue'
import { ReactComponent as MinusSvg } from '../resource/minus.svg'
import { ReactComponent as PlusSvg } from '../resource/plus.svg'
import { ReactComponent as WarningSvg } from '../resource/warning.svg'
import style from './MutableValueComp.module.css'

export interface MutableValueCompProps {
	_value: IMutableValue
	_setValue: (v: IMutableValue) => void
	_min: number
	_isIncome?: boolean
}

export function MutableValueComp({
	_value,
	_setValue,
	_min,
	_isIncome,
}: MutableValueCompProps) {
	function setValue(diff: number) {
		const change = _value.change + diff
		const result = _value.current + change
		const isValid = result >= _min
		_setValue({
			..._value,
			change,
			isValid,
		})
	}
	return (
		<div className={style.wrapper}>
			<button
				type='button'
				className={style.subtract}
				onClick={e => {
					setValue(-1)
				}}
			>
				<MinusSvg className={`smallIcon`} />
			</button>{' '}
			<span
				className={[style.current, _isIncome && style.income]
					.filter(Boolean)
					.join(' ')}
			>
				{_value.current}
			</span>{' '}
			<button
				type='button'
				className={style.add}
				onClick={e => {
					setValue(1)
				}}
			>
				<PlusSvg className={`smallIcon`} />
			</button>{' '}
			{_value.change !== 0 && (
				<div
					className={[style.change, !_value.isValid && style.invalid]
						.filter(Boolean)
						.join(' ')}
				>
					{!_value.isValid && (
						<WarningSvg
							width={16}
							height={16}
							className={style.warningIcon}
						/>
					)}{' '}
					{formatChange(_value.change)}
				</div>
			)}
		</div>
	)
}
