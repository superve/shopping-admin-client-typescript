import propTypes, { array, number } from "vue-types";
import { ExtractPropTypes } from "vue"

export type FilterKey = {
    key?: string,
    value?: string,
    disabled?: boolean
}

export const filterProps = () => ({
    filterKeys: array<FilterKey>().def([]).isRequired
})

export type FilterProps = Partial<ExtractPropTypes<ReturnType<typeof filterProps>>>;