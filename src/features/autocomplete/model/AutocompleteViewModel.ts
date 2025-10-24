import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { getCountryByName } from '../../../entities/country/model/api'
import { CountryInfo } from '../../../entities/country/model/country.types'
import { BaseInputViewModel } from '../../../entities/input/model/BaseInputViewModel'

export class AutocompleteViewModel extends BaseInputViewModel {
	suggestions: CountryInfo[] = []
	isLoading = false
	isOpen = false
	maxSuggestions = 10
	private currentRequestId = 0

	constructor(maxSuggestions = 10) {
		super()
		this.maxSuggestions = maxSuggestions
		makeObservable(this, {
			suggestions: observable,
			isLoading: observable,
			isOpen: observable,
			visibleSuggestions: computed,
			fetchSuggestions: action,
			selectSuggestion: action,
			closeSuggestions: action,
		})
	}

	get visibleSuggestions() {
		const seen = new Set<string>()
		return this.suggestions
			.filter(s => {
				const key = `${s.name}-${s.fullName}`
				if (seen.has(key)) return false
				seen.add(key)
				return true
			})
			.slice(0, this.maxSuggestions)
	}

	async fetchSuggestions(query: string) {
		if (!query.trim()) {
			runInAction(() => {
				this.suggestions = []
				this.isOpen = false
				this.isLoading = false
			})
			return
		}

		const requestId = ++this.currentRequestId
		this.isLoading = true

		try {
			const results = await getCountryByName(query)
			if (requestId === this.currentRequestId) {
				runInAction(() => {
					this.suggestions = results
					this.isOpen = results.length > 0
					this.isLoading = false
				})
			}
		} catch {
			runInAction(() => {
				this.isLoading = false
				this.isOpen = false
			})
		}
	}

	selectSuggestion(s: CountryInfo) {
		this.value = s.name
		this.isOpen = false
	}

	closeSuggestions() {
		this.isOpen = false
	}
}
