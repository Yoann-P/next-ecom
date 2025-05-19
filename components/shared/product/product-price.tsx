import {cn} from "@/lib/utils";


const ProductPrice = ({value, className}: { value: number, className?: string }) => {
    const stringValue = value.toFixed(2)
    const [intValue, floatValue] = stringValue.split('.')

    return (
        <p className={cn('text-2xl', className)}>

            {intValue}
            <span className='text-xs align-super'>.{floatValue}</span>
            <span className={"text-xs align-super"}>€</span>
        </p>
    )
}
export default ProductPrice
