import * as React from 'react'
import { formatChange } from '../function/formatChange'
import { IMutableValue } from '../model/IMutableValue'
import { ReactComponent as WarningSvg } from '../resource/warning.svg'
import style from './MutableValueComp.module.css'

export interface MutableValueCompProps {
	_value: IMutableValue
	_setValue: (v: IMutableValue) => void
	_min: number
	_max: number
	_isIncome?: boolean
	_canChangeALot?: boolean
}

export function MutableValueComp({
	_value,
	_setValue,
	_min,
	_max,
	_isIncome,
	_canChangeALot,
}: MutableValueCompProps) {
	function setValue(diff: number) {
		const change = _value.change + diff
		const result = _value.current + change
		const isValid = result <= _max && result >= _min
		_setValue({
			..._value,
			change,
			isValid,
		})
	}
	return (
		<>
			{_canChangeALot && (
				<button
					type='button'
					onClick={() => {
						setValue(-5)
					}}
				>
					-5
				</button>
			)}{' '}
			<button
				type='button'
				onClick={() => {
					setValue(-1)
				}}
			>
				-1
			</button>{' '}
			<span
				className={[style.value, _isIncome && style.income]
					.filter(Boolean)
					.join(' ')}
			>
				{_value.current}
			</span>{' '}
			<button
				type='button'
				onClick={() => {
					setValue(1)
				}}
			>
				+1
			</button>{' '}
			{_canChangeALot && (
				<button
					type='button'
					onClick={() => {
						setValue(5)
					}}
				>
					+5
				</button>
			)}
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
							fill='currentColor'
						/>
					)}{' '}
					{formatChange(_value.change)}
				</div>
			)}
		</>
	)
}
