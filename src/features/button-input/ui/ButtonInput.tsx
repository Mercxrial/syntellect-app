import { observer } from 'mobx-react-lite'
import React from 'react'
import { ButtonInputViewModel } from '../model/ButtonInputViewModel'
import styles from './ButtonInput.module.scss'

interface ButtonConfig {
	text: string
	onClick: () => void
}

interface Props {
	viewModel: ButtonInputViewModel
	leftButtons?: ButtonConfig[]
	rightButtons?: ButtonConfig[]
	placeholder?: string
}

export const ButtonInput: React.FC<Props> = observer(
	({
		viewModel,
		leftButtons = [],
		rightButtons = [],
		placeholder = 'Введите текст...',
	}) => (
		<div className={styles.wrapper}>
			{leftButtons.map((btn, idx) => (
				<button
					key={`left-${idx}`}
					onClick={btn.onClick}
					className={styles.button}
				>
					{btn.text}
				</button>
			))}

			<input
				value={viewModel.value}
				onChange={e => viewModel.setValue(e.target.value)}
				placeholder={placeholder}
				className={styles.input}
			/>

			{rightButtons.map((btn, idx) => (
				<button
					key={`right-${idx}`}
					onClick={btn.onClick}
					className={styles.button}
				>
					{btn.text}
				</button>
			))}
		</div>
	)
)
