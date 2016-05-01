/// <reference path="../react/react.d.ts" />

declare namespace __REACT_AUTOCOMPLETE {
    import React = __React;
    
    interface props {
        value?: string,
        onChange?: (event: React.KeyboardEvent, value: string) => void,
        onSelect?: (value: string, item: any) => void,
        getItemValue: (item: any) => string
        shouldItemRender?: (item: any) => boolean,
        renderItem: (item: any, isHighlighted: boolean) => JSX.Element,
        menuStyle?: React.CSSProperties,
        inputProps?: React.HTMLProps<any>,
        labelText?: string,
        wrapperProps?: React.HTMLProps<any>,
        wrapperStyle?: React.CSSProperties
        renderMenu?: (items: JSX.Element[], value: string, style: React.CSSProperties) => JSX.Element
        items: any[]
    }
    
    interface Autocomplete extends React.ComponentClass<props> {}
}

declare module 'react-autocomplete' {
    var Autocomplete: __REACT_AUTOCOMPLETE.Autocomplete;
    export = Autocomplete;
}