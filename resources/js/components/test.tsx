"use client"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

interface Options {
    label: string
    value: string
}

interface Props {
    items: Options[]
    value?: string
    onChange: (value: string | null) => void
}

export function ComboboxBasic({ items, value, onChange }: Props) {

    const selectedItem = items.find(item => item.value === value)

    return (
        <Combobox
            value={value ?? undefined}
            items={items}
            onValueChange={onChange}
        >
            <ComboboxInput
                placeholder="Select an option"

            />

            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item.value} value={item.value}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}