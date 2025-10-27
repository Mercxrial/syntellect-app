import { action, makeObservable, observable } from 'mobx'

export class BaseInputViewModel {
	value: string = ''

	constructor() {
		makeObservable(this, {
			value: observable,
			setValue: action,
			clear: action,
		})
	}

	setValue(newValue: string) {
		this.value = newValue
	}

	clear() {
		this.value = ''
	}
}
