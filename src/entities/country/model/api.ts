import { getRandom } from '../../../shared/lib/getRandom'
import countries from './countries.json'
import { CountryInfo } from './country.types'

export async function getCountryByName(
	countryName: string
): Promise<CountryInfo[]> {
	await new Promise(resolve => {
		setTimeout(resolve, getRandom(100, 800))
	})
	if (typeof countryName !== 'string' || !countryName) {
		return []
	}
	const searchText = countryName.toLocaleLowerCase()
	return countries.filter(
		x =>
			x.name.toLocaleLowerCase().startsWith(searchText) ||
			x.fullName.toLocaleLowerCase().startsWith(searchText)
	)
}
