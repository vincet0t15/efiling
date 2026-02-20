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
    id: string
}

interface Props {
    items: Options[],
    value?: string;
    onChange: (value: string | null) => void;
}
export function ComboboxBasic({ items, value, onChange }: Props) {
    return (
        <Combobox value={value || undefined} items={items} onValueChange={onChange}>
            <ComboboxInput
                placeholder="Select an option"
                value={items.find((item) => item.id === value)?.label || ""}
            />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item.id} value={item.id}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}
